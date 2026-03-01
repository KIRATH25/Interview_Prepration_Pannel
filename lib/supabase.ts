import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://nnoyqzdjiirbckvxblmc.supabase.co';
// Using the provided publishable key as the anon key
const SUPABASE_ANON_KEY = 'sb_publishable_QhV3ozovjrI58G5coS3yDQ_nZAva-So';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);