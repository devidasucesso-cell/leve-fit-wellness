-- Add DELETE policy for notification_settings table
-- This allows users to delete their own notification preferences
CREATE POLICY "Users can delete their own notification settings"
ON public.notification_settings
FOR DELETE
USING (auth.uid() = user_id);