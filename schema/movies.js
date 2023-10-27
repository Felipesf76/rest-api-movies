const zod = require('zod')

const movieSchema = zod.object({
  titulo: zod.string({
    invalid_type_error: 'El titulo debe ser un string',
    required_error: 'El titulo es obligatorio'
  }),
  año: zod.number().int().positive().min(1900).max(3000),
  calificacion: zod.number().min(0).max(10),
  generos: zod.array(
    zod.enum([
      'Acción',
      'Fantasía',
      'Drama',
      'Terror',
      'Crimen',
      'Romance',
      'Ciencia Ficción',
      'Aventura',
      'Suspenso'
    ]),
    {
      required_error: 'El campo es obligatorio'
    }
  ),
  cartelera: zod.string().url()
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validatePartialMovie,
  validateMovie
}
