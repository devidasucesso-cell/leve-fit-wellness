-- Update the handle_new_user function to accept kit_type from user metadata
-- This eliminates the race condition by setting kit_type atomically during profile creation

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    name,
    kit_type,
    treatment_start_date
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    NEW.raw_user_meta_data ->> 'kit_type',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'kit_type' IS NOT NULL 
      THEN CURRENT_DATE
      ELSE NULL
    END
  );
  
  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;