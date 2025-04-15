import prisma from '../config/db.js'

// compartilhar formulário com usuário
const shareFormWithUser = async (formId, userId) => {
    return await prisma.sharedForm.create({
        data: { formId, userId }
    });
};

// buscar formulários compartilhados com o usuário
const getSharedFormsByUser = async (userId) => {
    return await prisma.sharedForm.findMany({
        where: {userId: parseInt(userId, 10)},
        include: { form: {
            include: {
                user:true
            }
        } }
    });
}


export { shareFormWithUser, getSharedFormsByUser };