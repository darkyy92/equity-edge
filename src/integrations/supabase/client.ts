
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://vvfixcjsxkshtgmmygsi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Zml4Y2pzeGtzaHRnbW15Z3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzODkzNTksImV4cCI6MjA0Nzk2NTM1OX0.c0XWYthv5XHBYVE9WhOTxd0dEbTF-YiLQLplhR5JRKE";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
