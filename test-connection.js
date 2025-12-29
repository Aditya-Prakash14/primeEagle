import { supabase } from './src/lib/supabase.js'

console.log('🔍 Testing Supabase Connection...\n')

// Test 1: Check environment variables
console.log('✅ Environment Variables:')
console.log('   VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing')
console.log('   VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing')
console.log('')

// Test 2: Test Supabase connection
async function testConnection() {
  try {
    console.log('🔌 Testing Supabase Connection...')
    
    // Try to fetch from a public table (this will fail if table doesn't exist, but connection should work)
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('⚠️  Connection successful, but profiles table not found')
        console.log('   Please run the schema SQL in Supabase Dashboard')
        console.log('   File: supabase_schema.sql')
      } else {
        console.log('❌ Connection error:', error.message)
      }
    } else {
      console.log('✅ Successfully connected to Supabase!')
      console.log('✅ Profiles table exists and is accessible')
    }
  } catch (err) {
    console.log('❌ Error:', err.message)
  }
  
  // Test 3: Check auth status
  console.log('\n👤 Checking Auth Status...')
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    console.log('✅ User is logged in:', session.user.email)
  } else {
    console.log('ℹ️  No active session (not logged in)')
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('🎉 Connection test complete!')
  console.log('='.repeat(50))
  console.log('\nNext steps:')
  console.log('1. Open http://localhost:5174')
  console.log('2. Click "Get Started" or go to /signup')
  console.log('3. Create an account')
  console.log('4. Login and view Dashboard')
  console.log('\nFor detailed testing guide, see: INTEGRATION_COMPLETE.md')
}

testConnection()
