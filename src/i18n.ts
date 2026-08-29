import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Languages the site's own UI (and per-flash content) is available in.
// Autonyms — each language's own name for itself, never translated — used
// by the language switcher and the first-visit language splash.
export const SUPPORTED_LANGS = ["pt", "en", "es"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
export const LANG_LABELS: Record<SupportedLang, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

// Resolves an i18next language tag (e.g. "en-US") to one of our supported
// locale codes, falling back to Portuguese. Centralizes what used to be a
// duplicated `i18n.language.startsWith("pt") ? "pt" : "en"` ternary across
// several components.
export function resolveLocale(language: string): SupportedLang {
  const short = language.slice(0, 2).toLowerCase();
  return (SUPPORTED_LANGS as readonly string[]).includes(short)
    ? (short as SupportedLang)
    : "pt";
}

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About me",
        flashes: "Flashbook",
        info: "Session & Care",
        studio: "Studio",
      },
      topbar: {
        title: "FUFU TATTOO",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        language: "Language",
      },
      hero: {
        artist: "Tattoos, Illustrations and Painting",
        location: "Madrid, Spain",
        about: "About me",
        info: "Session & Care",
        studio: "Studio",
        flashes: "Flashbook",
      },
      aboutme: {
        title: "About me",
        paragraphs: [
          "Hi! I'm Flávia, but you can call me Fufu 🙂 Originally from Brazil, I spent four years in Lisbon and am now based in Madrid. I've always loved drawing and painting, and for the past three years, I've been living the dream of doing it professionally!",
          "My work flows naturally around the themes and techniques that inspire me. I love creating designs that are expressive and illustrative yet cozy and tender—pieces that bring a touch of enchantment, warmth, and whimsy to your daily life. While my favorite themes are flora, fauna, and fantasy, I'm always open to new ideas. I tattoo in both color and black & gray.",
          "Through my art, I aim to remind us of the wonderful, lush, magical world outside, helping people fall in love with nature and reconnect with the healing power of human imagination.",
          "Check out my Instagram, flashbook, and shop to explore my latest work. If you're looking for a tattoo or a commissioned painting or illustration, feel free to reach out through any channel!",
        ],
      },
      information: {
        title: "Session & Care",
        before: "Before session",
        remarkings: "Rescheduling",
        beforeText:
          "If you need to reschedule, do it as early as possible or at least 48h in advance. I don't require deposits, so I count on your commitment and common sense.",
        preCare: "Pre-tattoo care",
        preCareText:
          "In the days before the session, hydrate the area daily with a good body lotion, drink plenty of water, avoid direct sun over the area and use sunscreen. Avoid alcohol 24h before the session.",
        yourSkin: "Your skin",
        skinText:
          "I cannot tattoo skin that is injured, sunburned or has any abnormality. If you notice something, let me know!",
        during: "On session day",
        duringParagraphs: [
          "Sleep well and eat properly. Bring snacks, water and distractions. You can bring one companion.",
          "All materials are professional and sterilized. Tattooing is not rushed; schedule it on a relaxed day.",
          "Don't be afraid to suggest design or stencil placement changes. This does not make you a difficult client; your confidence is essential before we start.",
          "At Vira Lata, we sometimes have our senior dog Gringo in common areas. If you have allergies or concerns, please let me know.",
        ],
        after: "After session",
        afterParagraphs: [
          "At the end of the session, I apply second skin to protect your tattoo. Replace after 24h and keep it for another 48h.",
          "When changing second skin, clean the tattoo with neutral soap and dry gently. Keep this routine through healing.",
          "Apply ointment sparingly once the tattoo is dry and peeling. Avoid over-application.",
          "Resist scratching or picking scabs; it is bad for healing.",
          "In the first week, avoid activities that stretch the tattooed area, sweating, and friction. Avoid direct sun and immersion for two weeks.",
          "You may eat and drink normally, but avoid excess and watch for allergies or poor healing history.",
          "Touch-ups may be needed and are usually free, with a small 5€ material contribution if no additional tattoo is done.",
          "Feedback is very welcome! Please share your experience and healing process so I can improve service and space.",
        ],
        otherCare: "Other care",
      },
      studio: {
        title: "Studio",
        paragraph1:
          "I tattoo at Vira Lata 🐶, an artist collective and tattoo studio in central Lisbon, Penha de França. The space is relaxed, cozy and well-equipped for safe and comfortable sessions.",
        paragraph2:
          "The studio is easy to access: 15 minutes on foot from Arroios station (green line), with several bus lines nearby.",
      },
      flashes: {
        title: "Flashbook",
        searchPlaceholder: "Search flashes",
        total: "{{count}} flashes",
        filterByTag: "Filter by tag:",
        noImage: "No image",
        backButton: "← Back",
        description: "Description",
        recommendedSize: "Recommended size",
        centimeters: "Centimeters",
        inches: "Inches",
        sizeMin: "Min",
        sizeMax: "Max",
        sizeRec: "Rec.",
        option: "Option {{number}}",
        tags: "Tags",
        maybeAlsoLike: "You may also like",
        bookWhatsapp: "Chat about this flash",
        whatsappMessage:
          "Hi! I saw the flash '{{name}}' (id: {{id}}) and I'd like to know more about it 🙂",
        loading: "Loading...",
        notFound: "Flash not found.",
        clearTags: "Clear",
        moreTags: "▼ more tags",
        fewerTags: "▲ fewer tags",
      },
    },
  },
  pt: {
    translation: {
      nav: {
        home: "Home",
        about: "Sobre mim",
        flashes: "Flashbook",
        info: "Sessão e Cuidados",
        studio: "O Estúdio",
      },
      topbar: {
        title: "FUFU TATTOO",
        openMenu: "Abrir menu",
        closeMenu: "Fechar menu",
        language: "Idioma",
      },
      hero: {
        artist: "Tatuagens, Ilustrações e Pintura",
        location: "Madrid, Espanha",
        about: "Sobre mim",
        info: "Sessão e Cuidados",
        studio: "O Estúdio",
        flashes: "Flashbook",
      },
      aboutme: {
        title: "Sobre mim",
        paragraphs: [
          "Oi! Sou a Flávia, mas pode me chamar de Fufu 🙂 Originalmente do Brasil, morei quatro anos em Lisboa e agora estou baseada em Madrid. Sempre amei desenhar e pintar, e nos últimos três anos, estou vivendo o sonho de fazer isso profissionalmente!",
          "Meu trabalho flui naturalmente ao redor dos temas e técnicas que me inspiram. Adoro criar desenhos expressivos e ilustrativos, mas também aconchegantes e ternos — peças que trazem um toque de encantamento, calor e magia para o seu dia a dia. Meus temas favoritos são flora, fauna e fantasia, mas estou sempre aberta a novas ideias. Tatuo tanto em cores quanto em preto e cinza.",
          "Através da minha arte, busco lembrar do mundo maravilhoso, exuberante e mágico lá fora, ajudando as pessoas a se apaixonarem pela natureza e a se reconectarem com o poder curativo da imaginação humana.",
          "Confira meu Instagram, flashbook e loja para ver meus trabalhos mais recentes. Se você está procurando uma tatuagem ou uma pintura ou ilustração sob encomenda, sinta-se à vontade para entrar em contato por qualquer canal!",
        ],
      },
      information: {
        title: "Sessão e Cuidados",
        before: "Antes da sessão",
        remarkings: "Remarcações",
        beforeText:
          "Se precisar remarcar, solicite com a maior antecedência possível ou ao menos 48h antes. Não trabalho com depósitos, então conto com seu compromisso e bom senso.",
        preCare: "Cuidados pré-tattoo",
        preCareText:
          "Nos dias anteriores à sessão, hidrate a área diariamente, beba bastante água, evite sol direto e use protetor solar. Não consuma álcool nas 24h anteriores à sessão.",
        yourSkin: "Sua pele",
        skinText:
          "Não posso tatuar se a pele estiver machucada, queimada ou com qualquer anormalidade. Se notar algo, me avise!",
        during: "No dia da sessão",
        duringParagraphs: [
          "Durma bem e esteja bem alimentado. Traga snacks, água e distrações. Você pode trazer 1 acompanhante.",
          "Todos os materiais são profissionais e esterilizados. Tatuagem não combina com pressa; marque para um dia tranquilo.",
          "Não tenha medo de sugerir mudanças no design ou posicionamento do stencil. Isso não te torna cliente difícil; sua confiança é essencial antes de começar.",
          "No Vira Lata, temos às vezes a companhia do Gringo em áreas comuns. Se tiver alergia ou preocupação, me avise.",
        ],
        after: "Após a sessão",
        afterParagraphs: [
          "Ao final da sessão, aplico second skin para proteger sua tattoo. Troque após 24h e mantenha por mais 48h.",
          "Ao trocar a second skin, limpe a tatuagem com sabão neutro e seque gentilmente. Mantenha essa rotina até a cicatrização.",
          "Aplique pomada com moderação quando a tatuagem estiver seca e descamando. Evite excesso.",
          "Resista a coçar ou puxar casquinhas; isso prejudica a cicatrização.",
          "Na primeira semana, evite exercícios que estiquem a área, suor e fricção. Evite sol direto e submersão por duas semanas.",
          "Você pode comer e beber normalmente, evite excessos e fique atento a alergias ou histórico de má cicatrização.",
          "O retoque pode ser necessário e costuma ser gratuito, com pequena contribuição de 5€ para material se não fizer outra tattoo na mesma sessão.",
          "Feedback é bem-vindo! Conte sua experiência e processo de cicatrização para melhorar o espaço e atendimento.",
        ],
        otherCare: "Outros cuidados",
      },
      studio: {
        title: "Estúdio",
        paragraph1:
          "Tattoo no Vira Lata 🐶, coletivo de artistas no coração de Lisboa, Penha de França. O espaço é descolado, aconchegante e equipado para uma sessão segura e confortável.",
        paragraph2:
          "O estúdio é de fácil acesso: 15 minutos a pé da estação Arroios (linha verde), com várias linhas de ônibus na região.",
      },
      flashes: {
        title: "Flashbook",
        searchPlaceholder: "Buscar flashes",
        total: "{{count}} flashes",
        filterByTag: "Filtrar por tag:",
        noImage: "Sem imagem",
        backButton: "← Voltar",
        description: "Descrição",
        recommendedSize: "Tamanho recomendado",
        centimeters: "Centímetros",
        inches: "Polegadas",
        sizeMin: "Mín",
        sizeMax: "Máx",
        sizeRec: "Rec.",
        option: "Opção {{number}}",
        tags: "Tags",
        maybeAlsoLike: "Você também pode gostar",
        bookWhatsapp: "Conversar sobre este flash",
        whatsappMessage:
          "Oi! Vi o flash '{{name}}' (id: {{id}}) e gostaria de saber mais 🙂",
        loading: "Carregando...",
        notFound: "Flash não encontrado.",
        clearTags: "Limpar",
        moreTags: "▼ mais tags",
        fewerTags: "▲ menos tags",
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        about: "Sobre mí",
        flashes: "Flashbook",
        info: "Sesión y Cuidados",
        studio: "Estudio",
      },
      topbar: {
        title: "FUFU TATTOO",
        openMenu: "Abrir menú",
        closeMenu: "Cerrar menú",
        language: "Idioma",
      },
      hero: {
        artist: "Tatuajes, Ilustraciones y Pintura",
        location: "Madrid, España",
        about: "Sobre mí",
        info: "Sesión y Cuidados",
        studio: "Estudio",
        flashes: "Flashbook",
      },
      aboutme: {
        title: "Sobre mí",
        paragraphs: [
          "¡Hola! Soy Flávia, pero puedes llamarme Fufu 🙂 Originaria de Brasil, viví cuatro años en Lisboa y ahora estoy basada en Madrid. Siempre amé dibujar y pintar, y en los últimos tres años, estoy viviendo el sueño de hacerlo profesionalmente.",
          "Mi trabajo fluye naturalmente alrededor de los temas y técnicas que me inspiran. Me encanta crear diseños expresivos e ilustrativos, pero a la vez acogedores y tiernos — piezas que traen un toque de encanto, calidez y magia a tu día a día. Mis temas favoritos son la flora, la fauna y la fantasía, pero siempre estoy abierta a nuevas ideas. Tatúo tanto a color como en blanco y negro.",
          "A través de mi arte, busco recordarnos el mundo maravilloso, exuberante y mágico de afuera, ayudando a las personas a enamorarse de la naturaleza y a reconectar con el poder sanador de la imaginación humana.",
          "Echa un vistazo a mi Instagram, flashbook y tienda para ver mis trabajos más recientes. Si buscas un tatuaje o una pintura o ilustración por encargo, ¡no dudes en contactarme por cualquier canal!",
        ],
      },
      information: {
        title: "Sesión y Cuidados",
        before: "Antes de la sesión",
        remarkings: "Reprogramaciones",
        beforeText:
          "Si necesitas reprogramar, avisa con la mayor antelación posible o al menos 48h antes. No trabajo con depósitos, así que cuento con tu compromiso y sentido común.",
        preCare: "Cuidados pre-tatuaje",
        preCareText:
          "En los días previos a la sesión, hidrata la zona a diario, bebe mucha agua, evita el sol directo y usa protector solar. Evita el alcohol 24h antes de la sesión.",
        yourSkin: "Tu piel",
        skinText:
          "No puedo tatuar piel que esté lastimada, quemada por el sol o con cualquier anormalidad. ¡Si notas algo, avísame!",
        during: "El día de la sesión",
        duringParagraphs: [
          "Duerme bien y come adecuadamente. Trae snacks, agua y distracciones. Puedes traer un acompañante.",
          "Todos los materiales son profesionales y esterilizados. El tatuaje no se hace con prisa; agenda un día tranquilo.",
          "No tengas miedo de sugerir cambios en el diseño o la colocación del stencil. Esto no te convierte en un cliente difícil; tu confianza es esencial antes de empezar.",
          "En Vira Lata, a veces tenemos a nuestro perro mayor Gringo en las áreas comunes. Si tienes alergias o preocupaciones, avísame por favor.",
        ],
        after: "Después de la sesión",
        afterParagraphs: [
          "Al final de la sesión, aplico second skin para proteger tu tatuaje. Cámbiala después de 24h y mantenla otras 48h.",
          "Al cambiar la second skin, limpia el tatuaje con jabón neutro y seca suavemente. Mantén esta rutina durante la cicatrización.",
          "Aplica pomada con moderación una vez que el tatuaje esté seco y descamando. Evita el exceso.",
          "Resiste la tentación de rascar o arrancar las costras; es malo para la cicatrización.",
          "En la primera semana, evita actividades que estiren la zona tatuada, el sudor y la fricción. Evita el sol directo y la inmersión durante dos semanas.",
          "Puedes comer y beber con normalidad, pero evita excesos y presta atención a alergias o antecedentes de mala cicatrización.",
          "Los retoques pueden ser necesarios y suelen ser gratuitos, con una pequeña contribución de 5€ para material si no se hace otro tatuaje en la misma sesión.",
          "¡Los comentarios son muy bienvenidos! Comparte tu experiencia y proceso de cicatrización para que pueda mejorar el servicio y el espacio.",
        ],
        otherCare: "Otros cuidados",
      },
      studio: {
        title: "Estudio",
        paragraph1:
          "Tatúo en Vira Lata 🐶, un colectivo de artistas y estudio de tatuajes en el centro de Lisboa, Penha de França. El espacio es relajado, acogedor y está bien equipado para sesiones seguras y cómodas.",
        paragraph2:
          "El estudio es de fácil acceso: 15 minutos a pie desde la estación de Arroios (línea verde), con varias líneas de autobús cerca.",
      },
      flashes: {
        title: "Flashbook",
        searchPlaceholder: "Buscar flashes",
        total: "{{count}} flashes",
        filterByTag: "Filtrar por etiqueta:",
        noImage: "Sin imagen",
        backButton: "← Volver",
        description: "Descripción",
        recommendedSize: "Tamaño recomendado",
        centimeters: "Centímetros",
        inches: "Pulgadas",
        sizeMin: "Mín",
        sizeMax: "Máx",
        sizeRec: "Rec.",
        option: "Opción {{number}}",
        tags: "Etiquetas",
        maybeAlsoLike: "También te puede gustar",
        bookWhatsapp: "Hablar sobre este flash",
        whatsappMessage:
          "¡Hola! Vi el flash '{{name}}' (id: {{id}}) y me gustaría saber más 🙂",
        loading: "Cargando...",
        notFound: "Flash no encontrado.",
        clearTags: "Limpiar",
        moreTags: "▼ más etiquetas",
        fewerTags: "▲ menos etiquetas",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
