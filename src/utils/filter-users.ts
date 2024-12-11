import { prisma } from "./prisma";

export async function filterRelevantUsers(impactVector: number[]) {
  const availableBiomes = [
    "Mata Atlântica", "Caatinga", "Amazônia", "Pampas", "Pantanal", "Cerrado", "Zonas Urbanas",
  ];

  const availablePeoples = [
    "Agricultor Familiar", "Indígenas", "Quilombolas", "Fundo de Pasto", "Gerais",
    "Pescadores Ribeirinhos", "Pescadores/Marisqueiras", "Cidades", "Geraizeiros",
    "Religiosos", "Ciganos", "Nômades", "Outros",
  ];

  // Buscar usuários e seus relacionamentos com biomas e povos
  const users = await prisma.user.findMany({
    include: {
      themesBiomes: true, // Certifique-se de que o modelo está correto
      peoples: true,
      Impacts: true,
    },
  });

  console.log("Users fetched from database:", users);

  const relevantUsers = users.filter((user) => {
    const userVector = Array(availableBiomes.length + availablePeoples.length).fill(0);

    // Validar e preencher vetor com biomas associados
    if (user.themesBiomes && Array.isArray(user.themesBiomes)) {
      user.themesBiomes.forEach((biome) => {
        const index = availableBiomes.indexOf(biome.name.trim());
        if (index !== -1) {
          userVector[index] = 1;
        } else {
          console.warn(`Biome "${biome.name}" not found in available biomes.`);
        }
      });
    }

    // Validar e preencher vetor com povos associados
    if (user.peoples && Array.isArray(user.peoples)) {
      user.peoples.forEach((people) => {
        const index = availablePeoples.indexOf(people.name.trim());
        if (index !== -1) {
          userVector[availableBiomes.length + index] = 1;
        } else {
          console.warn(`People "${people.name}" not found in available peoples.`);
        }
      });
    }

    console.log("User Vector for", user.id, ":", userVector);

    // Calcular relevância como produto escalar
    const relevance = userVector.reduce((sum, val, index) => sum + val * impactVector[index], 0);

    console.log("Relevance for user", user.id, ":", relevance);

    return relevance > 0;
  });

  console.log("Relevant users:", relevantUsers.map((user) => user.id));

  return relevantUsers;
}
