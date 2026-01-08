-- Create atomic function to claim access codes (prevents race conditions)
CREATE OR REPLACE FUNCTION claim_access_code(
  code_input text,
  claiming_user_id uuid
)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  code_record access_codes%ROWTYPE;
  result json;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT * INTO code_record
  FROM access_codes
  WHERE code = code_input
  FOR UPDATE NOWAIT;
  
  -- Check if code not found
  IF NOT FOUND THEN
    result := json_build_object(
      'success', false,
      'error', 'CODE_NOT_FOUND'
    );
    RETURN result;
  END IF;
  
  -- Check if already used
  IF code_record.is_used THEN
    result := json_build_object(
      'success', false,
      'error', 'CODE_ALREADY_USED'
    );
    RETURN result;
  END IF;
  
  -- Atomically claim the code
  UPDATE access_codes
  SET is_used = true,
      used_by = claiming_user_id,
      used_at = now()
  WHERE id = code_record.id;
  
  -- Update profile
  UPDATE profiles
  SET code_validated = true,
      is_approved = true
  WHERE user_id = claiming_user_id;
  
  result := json_build_object(
    'success', true,
    'code_id', code_record.id
  );
  RETURN result;
EXCEPTION
  WHEN lock_not_available THEN
    result := json_build_object(
      'success', false,
      'error', 'CODE_LOCKED'
    );
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION claim_access_code TO authenticated;