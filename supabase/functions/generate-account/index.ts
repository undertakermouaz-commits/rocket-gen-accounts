import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { service_id } = await req.json();
    console.log('Generating account for service:', service_id, 'user:', user.id);

    // Get or create user profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, email: user.email })
        .select()
        .single();
      
      if (insertError) {
        console.error('Profile insert error:', insertError);
        return new Response(JSON.stringify({ error: 'Failed to create profile' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      profile = newProfile;
    }

    // Check if it's a new day, reset counter
    const today = new Date().toISOString().split('T')[0];
    const lastGenDate = profile.last_generation_date;
    
    let accountsToday = profile.accounts_generated_today || 0;
    
    if (lastGenDate !== today) {
      accountsToday = 0;
    }

    // Check daily limit (10 accounts per day)
    if (accountsToday >= 10) {
      return new Response(JSON.stringify({ 
        error: 'Daily limit reached', 
        message: 'You can only generate 10 accounts per day. Try again tomorrow!' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find an available account for this service
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('service_id', service_id)
      .eq('is_claimed', false)
      .limit(1)
      .maybeSingle();

    if (accountError) {
      console.error('Account fetch error:', accountError);
      return new Response(JSON.stringify({ error: 'Failed to fetch account' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!account) {
      return new Response(JSON.stringify({ 
        error: 'No accounts available', 
        message: 'No accounts available for this service. Please try again later.' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Claim the account
    const { error: claimError } = await supabase
      .from('accounts')
      .update({ 
        is_claimed: true, 
        claimed_by: user.id, 
        claimed_at: new Date().toISOString() 
      })
      .eq('id', account.id);

    if (claimError) {
      console.error('Claim error:', claimError);
      return new Response(JSON.stringify({ error: 'Failed to claim account' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Record the generation
    await supabase
      .from('generated_accounts')
      .insert({
        user_id: user.id,
        account_id: account.id,
        service_id: service_id
      });

    // Update profile counter
    await supabase
      .from('profiles')
      .update({ 
        accounts_generated_today: accountsToday + 1,
        last_generation_date: today
      })
      .eq('user_id', user.id);

    console.log('Account generated successfully:', account.id);

    return new Response(JSON.stringify({ 
      success: true,
      account: {
        email: account.email,
        password: account.password
      },
      remaining: 10 - (accountsToday + 1)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
