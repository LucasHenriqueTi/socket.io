import prisma from '../config/db.js'

// cria um usuário
const createUser= async (name) => {
    return await prisma.user.create({data:{name}});
};

// busca um usuário pelo id
const getUserById = async (userId) => {
    return await prisma.user.findUnique({
        where: {id: parseInt(userId, 10)}
    });
};

export  {createUser, getUserById}