import prisma from '../config/db.js'

// cria um formulário
const createForm = async (name, userId) => {
    return await prisma.form.create({
        data: {
          name,
          user: {
            connect: { id: Number(userId) }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    };

// busca todos os formulários
const getAllForms = async () => {
    return await prisma.form.findMany();
}

// buscar formulário por id
const getFormsById = async (formId) => {
    return await prisma.form.findUnique({
        where: {id: parseInt(formId, 10)}});
};

export {createForm, getFormsById, getAllForms};
