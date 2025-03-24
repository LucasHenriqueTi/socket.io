import prisma from '../config/db.js'

// cria um formulário
const createForm = async (name, userId) => {
    return await prisma.form.create({data: {name, userId}});
}

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
