import zod from 'zod';

export const SignUpValidator = zod.object({
    username : zod.string(),
    firstname : zod.string(),
    lastname : zod.string(),
    password : zod.string(),
})
export const LogInValidator = zod.object({
    username : zod.string(),
    password : zod.string(),
})
