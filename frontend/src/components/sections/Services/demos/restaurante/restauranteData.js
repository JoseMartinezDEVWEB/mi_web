// Catálogo de platos, categorías y opciones para la app móvil de restaurante "Gourmet Bistro & Grill"

export const CATEGORIAS_MENU = [
  { id: 'todos', nombre: 'Todos', icono: '🍽️' },
  { id: 'carnes', nombre: 'Carnes & Grill', icono: '🥩' },
  { id: 'hamburguesas', nombre: 'Burgers', icono: '🍔' },
  { id: 'pastas', nombre: 'Pastas & Mariscos', icono: '🍝' },
  { id: 'entradas', nombre: 'Entradas & Tapas', icono: '🥗' },
  { id: 'bebidas', nombre: 'Bebidas & Cocteles', icono: '🍹' },
  { id: 'postres', nombre: 'Postres Dulces', icono: '🍰' }
]

export const PLATOS_MENU = [
  {
    id: 1,
    categoria: 'carnes',
    nombre: 'Churrasco Black Angus 12oz',
    descripcion: 'Jugoso corte certificado a la parrilla de carbón, chimichurri casero, yucas al mojo o tostones crujientes.',
    precio: 1250,
    calorias: '680 kcal',
    tiempo: '20-25 min',
    calificacion: 4.9,
    reviews: 142,
    destacado: true,
    etiqueta: 'Recomendación Chef',
    imagen: '🥩',
    opcionesTermino: ['Término Medio (Jugoso)', 'Tres Cuartos', 'Bien Cocido'],
    guarniciones: ['Tostones', 'Yucas al Mojo', 'Papas Fritas Trufadas', 'Ensalada Verde'],
    extras: [
      { id: 'ex-1', nombre: 'Extra Chimichurri Especial', precio: 60 },
      { id: 'ex-2', nombre: 'Hongo Portobello Asado', precio: 150 },
      { id: 'ex-3', nombre: 'Queso Provolone Fundido', precio: 120 }
    ]
  },
  {
    id: 2,
    categoria: 'hamburguesas',
    nombre: 'J4 Truffle Bacon Burger',
    descripcion: 'Doble carne angus de 200g, queso cheddar fundido, tocineta crocante caramelizada, salsa trufada y pan brioche artesanal.',
    precio: 680,
    calorias: '820 kcal',
    tiempo: '15-18 min',
    calificacion: 4.8,
    reviews: 215,
    destacado: true,
    etiqueta: 'Más Vendido 🔥',
    imagen: '🍔',
    opcionesTermino: ['Término Medio', 'Tres Cuartos', 'Bien Cocido'],
    guarniciones: ['Papas Rústicas', 'Aros de Cebolla', 'Papas Dulces (Camote)'],
    extras: [
      { id: 'ex-4', nombre: 'Doble Tocineta Ahumada', precio: 90 },
      { id: 'ex-5', nombre: 'Huevo Frito a Caballo', precio: 65 },
      { id: 'ex-6', nombre: 'Extra Queso Pepper Jack', precio: 75 }
    ]
  },
  {
    id: 3,
    categoria: 'pastas',
    nombre: 'Fettuccine Alfredo con Camarones',
    descripcion: 'Pasta fresca hecha a mano bañada en cremosa salsa alfredo de parmesano reggiano de 24 meses y camarones salteados al ajillo.',
    precio: 890,
    calorias: '710 kcal',
    tiempo: '15-20 min',
    calificacion: 4.9,
    reviews: 98,
    destacado: true,
    etiqueta: 'Favorito',
    imagen: '🍝',
    opcionesTermino: [],
    guarniciones: ['Pan de Ajo Crujiente', 'Ensalada César'],
    extras: [
      { id: 'ex-7', nombre: 'Extra Queso Parmesano', precio: 80 },
      { id: 'ex-8', nombre: 'Trozos de Pollo a la Parrilla', precio: 160 },
      { id: 'ex-9', nombre: 'Champiñones Frescos', precio: 95 }
    ]
  },
  {
    id: 4,
    categoria: 'pastas',
    nombre: 'Mofongo Criollo con Mariscos Mixtos',
    descripcion: 'Plátano verde majado con chicharrón crujiente y ajo confitado, coronado con salsa criolla de camarones, pulpo y calamar.',
    precio: 950,
    calorias: '790 kcal',
    tiempo: '20-25 min',
    calificacion: 4.9,
    reviews: 178,
    destacado: true,
    etiqueta: 'Tradición Gourmet',
    imagen: '🍤',
    opcionesTermino: [],
    guarniciones: ['Caldo de Res Casero', 'Aguacate Fresco'],
    extras: [
      { id: 'ex-10', nombre: 'Extra Chicharrón Crocante', precio: 110 },
      { id: 'ex-11', nombre: 'Queso Frito Dominicano', precio: 85 }
    ]
  },
  {
    id: 5,
    categoria: 'carnes',
    nombre: 'Costillitas BBQ Ahumadas en Roble',
    descripcion: 'Costillas tiernas de cerdo cocinadas lentamente por 6 horas con glaseado casero de barbecue artesanal y miel de caña.',
    precio: 1050,
    calorias: '890 kcal',
    tiempo: '18-22 min',
    calificacion: 4.7,
    reviews: 120,
    destacado: false,
    etiqueta: 'Ahumado Especial',
    imagen: '🍖',
    opcionesTermino: [],
    guarniciones: ['Mazorca de Maíz Dulce', 'Ensalada Coleslaw', 'Papas Fritas'],
    extras: [
      { id: 'ex-12', nombre: 'Extra Salsa BBQ Bourbon', precio: 50 },
      { id: 'ex-13', nombre: 'Papas con Cheddar & Bacon', precio: 140 }
    ]
  },
  {
    id: 6,
    categoria: 'entradas',
    nombre: 'Ceviche Clásico Carite & Mango',
    descripcion: 'Pescado fresco del día marinado en jugo de limón criollo, cebolla morada, toque de ají caribeño, mango maduro y chips de plátano.',
    precio: 520,
    calorias: '320 kcal',
    tiempo: '10-12 min',
    calificacion: 4.8,
    reviews: 84,
    destacado: false,
    etiqueta: 'Ligero & Fresco',
    imagen: '🥗',
    opcionesTermino: [],
    guarniciones: ['Chips de Plátano Verde', 'Batata Glaseada'],
    extras: [
      { id: 'ex-14', nombre: 'Extra Chips de Plátano', precio: 45 },
      { id: 'ex-15', nombre: 'Porción Extra de Aguacate', precio: 70 }
    ]
  },
  {
    id: 7,
    categoria: 'entradas',
    nombre: 'Croquetas de Jamón Ibérico & Trufa',
    descripcion: '6 unidades de bechamel ultra cremosa elaborada a fuego lento con jamón ibérico de bellota y suave aceite de trufa blanca.',
    precio: 480,
    calorias: '410 kcal',
    tiempo: '10-15 min',
    calificacion: 4.9,
    reviews: 136,
    destacado: false,
    etiqueta: 'Para Compartir',
    imagen: '🧆',
    opcionesTermino: [],
    guarniciones: ['Alioli de Ajo Negro'],
    extras: [
      { id: 'ex-16', nombre: 'Dip de Tomate Especiado', precio: 40 }
    ]
  },
  {
    id: 8,
    categoria: 'bebidas',
    nombre: 'Mojito Artesanal Maracuyá & Menta',
    descripcion: 'Ron dominicano añejo, chinola natural (maracuyá), hojas frescas de hierbabuena, azúcar de caña y soda efervescente.',
    precio: 360,
    calorias: '180 kcal',
    tiempo: '5 min',
    calificacion: 4.9,
    reviews: 190,
    destacado: true,
    etiqueta: 'Cóctel de la Casa',
    imagen: '🍹',
    opcionesTermino: ['Con Alcohol (Ron Dominicano)', 'Sin Alcohol (Mocktail)'],
    guarniciones: [],
    extras: [
      { id: 'ex-17', nombre: 'Doble Shot de Ron Añejo', precio: 120 }
    ]
  },
  {
    id: 9,
    categoria: 'bebidas',
    nombre: 'Limonada de Coco Frappé',
    descripcion: 'Cremosa mezcla de leche de coco de Samaná, jugo de limón fresco y hielo granizado con borde escarchado de coco tostado.',
    precio: 250,
    calorias: '210 kcal',
    tiempo: '5 min',
    calificacion: 4.8,
    reviews: 95,
    destacado: false,
    etiqueta: 'Refrescante',
    imagen: '🥥',
    opcionesTermino: [],
    guarniciones: [],
    extras: []
  },
  {
    id: 10,
    categoria: 'postres',
    nombre: 'Tarta de Queso Vasca con Dulce de Leche',
    descripcion: 'Cheesecake horneado al estilo San Sebastián con interior cremoso y corazón fundente de dulce de leche dominicano.',
    precio: 390,
    calorias: '460 kcal',
    tiempo: '5-8 min',
    calificacion: 5.0,
    reviews: 210,
    destacado: true,
    etiqueta: 'Postre Estrella ⭐',
    imagen: '🍰',
    opcionesTermino: [],
    guarniciones: [],
    extras: [
      { id: 'ex-18', nombre: 'Bola de Helado de Vainilla', precio: 80 },
      { id: 'ex-19', nombre: 'Praliné de Nueces Caramelizadas', precio: 60 }
    ]
  }
]
