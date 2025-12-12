import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_PASSWORD = '0000advin';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, password, data } = await req.json();
    console.log('Admin action:', action);

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Invalid admin password' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'add_service': {
        const { name, icon, description } = data;
        const { data: service, error } = await supabase
          .from('services')
          .insert({ name, icon, description })
          .select()
          .single();
        
        if (error) {
          console.error('Add service error:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ success: true, service }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'add_account': {
        const { service_id, email, accountPassword } = data;
        const { data: account, error } = await supabase
          .from('accounts')
          .insert({ 
            service_id, 
            email, 
            password: accountPassword 
          })
          .select()
          .single();
        
        if (error) {
          console.error('Add account error:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ success: true, account }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'bulk_add_accounts': {
        const { service_id, accounts } = data;
        const accountsToInsert = accounts.map((acc: { email: string; password: string }) => ({
          service_id,
          email: acc.email,
          password: acc.password
        }));
        
        const { data: insertedAccounts, error } = await supabase
          .from('accounts')
          .insert(accountsToInsert)
          .select();
        
        if (error) {
          console.error('Bulk add error:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          count: insertedAccounts?.length || 0 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_services': {
        const { data: services, error } = await supabase
          .from('services')
          .select('*, accounts(count)')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Get services error:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ success: true, services }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_stats': {
        const { data: services } = await supabase
          .from('services')
          .select('id, name');
        
        const { count: totalAccounts } = await supabase
          .from('accounts')
          .select('*', { count: 'exact', head: true });
        
        const { count: availableAccounts } = await supabase
          .from('accounts')
          .select('*', { count: 'exact', head: true })
          .eq('is_claimed', false);
        
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        return new Response(JSON.stringify({ 
          success: true, 
          stats: {
            totalServices: services?.length || 0,
            totalAccounts: totalAccounts || 0,
            availableAccounts: availableAccounts || 0,
            totalUsers: totalUsers || 0
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete_service': {
        const { service_id } = data;
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', service_id);
        
        if (error) {
          console.error('Delete service error:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
