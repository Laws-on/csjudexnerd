UPDATE public.registrations r
SET student_email = u.email
FROM auth.users u
WHERE r.user_id = u.id
AND r.student_email IS NULL;