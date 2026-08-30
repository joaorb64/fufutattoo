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
        artist: "Tattoo Artist & Painter",
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
        rescheduling: "Rescheduling",
        reschedulingText:
          "I ask for a **25% deposit** when you book, which is deducted from the final price. If you need to reschedule, do it **as early as possible** or at least **48h in advance**. You can reschedule **only once**: if you need to cancel your second appointment, you'll have to make an **additional 25% payment** (not deducted from the final price) to reschedule again.",
        preCare: "Pre-tattoo care",
        preCareText:
          "In the days before the session, moisturise the area daily with a good body cream, drink plenty of water, avoid direct sun on the spot and use sunscreen. **No alcohol in the 24h before the session.**",
        yourSkin: "Your skin",
        skinText:
          "I can't tattoo skin that is injured, sunburned, irritated or has any abnormality. If you notice anything, **let me know!**",
        during: "On session day",
        duringParagraphs: [
          "Sleep well and come well fed. Bring your **snacks, water bottle and distractions**. You can bring **one companion**.",
          "All my materials are **professional and single-use**.",
          "Tattooing is a process that **can't be rushed** — it takes as long as it takes. Book your session on a **calm day** and don't come with a tight schedule, because I can't speed the process up.",
          "Don't be shy about **suggesting changes** to the stencil or the design — it doesn't make you a difficult client. It's extremely important to me that you're **200% confident** before we start.",
        ],
        after: "After session",
        afterParagraphs: [
          "At the end of the session I apply a **special film** to protect your tattoo. **Replace it after 24h**, making sure the tattoo is clean and dry, and keep the second film on for **another 48h**.",
          "Apply the ointment **sparingly, twice a day**, and only when the tattoo is **dry and peeling**. Avoid excess product, as it can encourage infections and slow healing. My favourite ointments are **Bepanthen Plus** and **Cicalfate**.",
          "Resist the urge to **scratch or pick the scabs** — it can really harm the final result.",
          "In the first week, avoid activities that overly stretch the tattooed area (like weight training), as well as sweat and friction. Avoid direct sun and soaking in water (pool, sea, etc.) for **two weeks**. **Showering is fine — and encouraged!**",
          "You can eat and drink normally, but **avoid excess** and watch out for possible allergies or a history of poor healing.",
          "A touch-up may be needed, and **that service is free**. That said, I ask for a small **10€** contribution towards materials if no additional tattoo is done. If you get another tattoo in the same session as the touch-up, the touch-up is **100% free**. :)",
          "Your **feedback** is very welcome! Share your experience and healing process so I can keep improving the service and the space.",
        ],
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
        priceFrom: "from",
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
        artist: "Tatuadora e Pintora",
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
        rescheduling: "Reagendamento",
        reschedulingText:
          "Solicito um **depósito de 25%** no momento do agendamento, que será abatido do valor final. Se precisar reagendar, faça-o **o mais cedo possível** ou com pelo menos **48h de antecedência**. Só é possível reagendar **uma vez**: se precisar cancelar o segundo agendamento, terá de fazer um **pagamento adicional de 25%** (que não será descontado do valor final) para poder reagendar novamente.",
        preCare: "Cuidados pré-tatuagem",
        preCareText:
          "Nos dias anteriores à sessão, hidrate a zona diariamente com um bom creme corporal, beba bastante água, evite a exposição solar direta no local e use protetor solar. **Não consuma álcool nas 24h anteriores à sessão.**",
        yourSkin: "A sua pele",
        skinText:
          "Não posso tatuar pele lesionada, queimada pelo sol, com irritações ou qualquer anormalidade. Se notar alguma coisa, **avise-me!**",
        during: "No dia da sessão",
        duringParagraphs: [
          "Durma bem e venha bem alimentado. Traga os seus **snacks, garrafa de água e distrações**. Pode trazer **um acompanhante**.",
          "Todos os meus materiais são **profissionais e descartáveis**.",
          "Tatuar é um processo que **não pode ser apressado**, demora o tempo que for necessário. Marque a sua sessão para um **dia tranquilo** e não venha com horários apertados, pois não posso apressar o processo.",
          "Não tenha receio de **sugerir alterações** ao stencil ou ao design — isso não te torna um cliente difícil. É extremamente importante para mim que esteja **200% confiante** antes de começarmos.",
        ],
        after: "Após a sessão",
        afterParagraphs: [
          "No final da sessão, aplico uma **película especial** para proteger a sua tatuagem. **Substitua-a após 24h**, garantindo que a tatuagem esteja limpa e seca, e mantenha a segunda película por **mais 48h**.",
          "Aplique a pomada **com moderação, 2 vezes ao dia**, e apenas quando a tatuagem estiver **seca e a descamar**. Evite o excesso de produto, pois pode facilitar infeções e atrasar a cicatrização. As minhas pomadas favoritas são a **Bepanthene Plus** e a **Cicalfate**.",
          "Resista à tentação de **coçar ou tirar as crostas** — isso pode prejudicar muito o resultado final.",
          "Na primeira semana, evite atividades que estiquem excessivamente a zona tatuada (como musculação), bem como suor e fricção. Evite a exposição solar direta e a imersão em água (piscina, mar, etc.) durante **duas semanas**. **Banho pode, e deve!**",
          "Pode comer e beber normalmente, mas **evite excessos** e fique atento(a) a possíveis alergias ou histórico de má cicatrização.",
          "Poderá ser necessário um **retoque, cujo serviço é gratuito**. Contudo, peço uma pequena contribuição de **10€** para o material caso não seja feita nenhuma tatuagem adicional. Se fizer outra tatuagem na mesma sessão do retoque, o retoque é **100% gratuito**. :)",
          "O seu **feedback** é muito bem-vindo! Partilhe a sua experiência e o processo de cicatrização para que eu possa melhorar o serviço e o espaço.",
        ],
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
        priceFrom: "a partir de",
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
        artist: "Tatuadora y Pintora",
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
        rescheduling: "Reprogramación",
        reschedulingText:
          "Solicito un **depósito del 25%** al reservar, que se descuenta del precio final. Si necesitas reprogramar, hazlo **lo antes posible** o con al menos **48h de antelación**. Solo se puede reprogramar **una vez**: si necesitas cancelar tu segunda cita, tendrás que hacer un **pago adicional del 25%** (que no se descuenta del precio final) para poder reprogramar de nuevo.",
        preCare: "Cuidados pre-tatuaje",
        preCareText:
          "En los días previos a la sesión, hidrata la zona a diario con una buena crema corporal, bebe mucha agua, evita la exposición solar directa en el lugar y usa protector solar. **No consumas alcohol en las 24h previas a la sesión.**",
        yourSkin: "Tu piel",
        skinText:
          "No puedo tatuar piel lesionada, quemada por el sol, irritada o con cualquier anormalidad. Si notas algo, **¡avísame!**",
        during: "El día de la sesión",
        duringParagraphs: [
          "Duerme bien y ven bien alimentado/a. Trae tus **snacks, botella de agua y distracciones**. Puedes traer **un acompañante**.",
          "Todos mis materiales son **profesionales y desechables**.",
          "Tatuar es un proceso que **no se puede apresurar**, lleva el tiempo que haga falta. Agenda tu sesión para un **día tranquilo** y no vengas con horarios ajustados, porque no puedo acelerar el proceso.",
          "No tengas reparo en **sugerir cambios** en el stencil o el diseño — eso no te convierte en un cliente difícil. Es extremadamente importante para mí que estés **200% seguro/a** antes de empezar.",
        ],
        after: "Después de la sesión",
        afterParagraphs: [
          "Al final de la sesión aplico una **película especial** para proteger tu tatuaje. **Cámbiala después de 24h**, asegurándote de que el tatuaje esté limpio y seco, y mantén la segunda película **otras 48h**.",
          "Aplica la pomada **con moderación, 2 veces al día**, y solo cuando el tatuaje esté **seco y descamando**. Evita el exceso de producto, ya que puede facilitar infecciones y retrasar la cicatrización. Mis pomadas favoritas son **Bepanthen Plus** y **Cicalfate**.",
          "Resiste la tentación de **rascar o arrancar las costras** — puede perjudicar mucho el resultado final.",
          "En la primera semana, evita actividades que estiren en exceso la zona tatuada (como el gimnasio), así como el sudor y la fricción. Evita la exposición solar directa y la inmersión en agua (piscina, mar, etc.) durante **dos semanas**. **¡Ducharse sí, y debes!**",
          "Puedes comer y beber con normalidad, pero **evita excesos** y presta atención a posibles alergias o antecedentes de mala cicatrización.",
          "Puede que necesites un retoque, y **ese servicio es gratuito**. No obstante, pido una pequeña contribución de **10€** para el material si no se hace ningún tatuaje adicional. Si te haces otro tatuaje en la misma sesión que el retoque, el retoque es **100% gratuito**. :)",
          "¡Tu **feedback** es muy bienvenido! Comparte tu experiencia y proceso de cicatrización para que pueda mejorar el servicio y el espacio.",
        ],
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
        priceFrom: "desde",
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
