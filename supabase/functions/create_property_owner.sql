CREATE OR REPLACE FUNCTION create_property_owner(
  owner_data JSONB,
  p_agency_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_owner_id UUID;
  result JSONB;
BEGIN
  -- Insert the owner
  INSERT INTO property_owners (
    first_name,
    last_name,
    email,
    phone_number,
    status
  )
  VALUES (
    (owner_data->>'first_name')::TEXT,
    (owner_data->>'last_name')::TEXT,
    (owner_data->>'email')::TEXT,
    (owner_data->>'phone_number')::TEXT,
    (owner_data->>'status')::owner_status
  )
  RETURNING id INTO new_owner_id;

  -- Create the agency-owner relationship
  INSERT INTO agency_owners (
    owner_id,
    agency_id
  )
  VALUES (
    new_owner_id,
    p_agency_id
  );

  -- Return the result
  SELECT jsonb_build_object(
    'id', new_owner_id,
    'first_name', owner_data->>'first_name',
    'last_name', owner_data->>'last_name',
    'email', owner_data->>'email',
    'phone_number', owner_data->>'phone_number',
    'status', owner_data->>'status'
  ) INTO result;

  RETURN result;
END;
$$;