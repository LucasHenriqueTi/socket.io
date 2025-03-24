import prisma from '../config/db.js'

// compartilhar formulário com usuário
const shareFormWithUser = async (formId, userId) => {
    return await prisma.sharedForm.create({
        data: { formId, userId }
    });
};

// buscar formulários compartilhados por usuário
const getSharedFormsByUser = async (userId) => {
    return await prisma.sharedForm.findMany({
        where: { userId },
        include: { form: true }
    });
}


export { shareFormWithUser, getSharedFormsByUser };