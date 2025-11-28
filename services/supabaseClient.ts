import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use the provided project URL.
const supabaseUrl = process.env.SUPABASE_URL || 'https://cksjhvciobczwrjjwsfd.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc2podmNpb2Jjendyamp3c2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDExMzgsImV4cCI6MjA3OTU3NzEzOH0.L2wfD1v-oI3B6N4Wl91GIjliUFdk2C8_AwEtFxFEw-w';

export const supabase = createClient(supabaseUrl, supabaseKey);