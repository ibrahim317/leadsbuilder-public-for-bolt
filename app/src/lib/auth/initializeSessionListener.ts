import { supabaseClient } from '../supabaseClient';
import { checkAdminRole } from './checkAdminRole';
import { ADMIN_STATUS_KEY } from './types';

/**
 * Initialize session listener
 */
function initializeSessionListener(): void {
  // Listen for auth state changes
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      // Store session in sessionStorage
      sessionStorage.setItem('sb-leadbuilder-session', JSON.stringify(session));
      
      // Check and store admin status
      if (session?.user?.id) {
        checkAdminRole(session.user.id).then(isAdmin => {
          sessionStorage.setItem(ADMIN_STATUS_KEY, String(isAdmin));
        });
      }
    } else if (event === 'SIGNED_OUT') {
      // Clear session
      sessionStorage.removeItem('sb-leadbuilder-session');
      sessionStorage.removeItem(ADMIN_STATUS_KEY);
    }
  });
  
  // Check initial session
  checkInitialSession();
}

/**
 * Check initial session on app load
 */
async function checkInitialSession(): Promise<void> {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    sessionStorage.setItem('sb-leadbuilder-session', JSON.stringify(session));
    
    // Check and store admin status
    if (session.user?.id) {
      const isAdmin = await checkAdminRole(session.user.id);
      sessionStorage.setItem(ADMIN_STATUS_KEY, String(isAdmin));
    }
  }
} 