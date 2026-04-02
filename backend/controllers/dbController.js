const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Category = require("../models/Category");
const Ticket = require("../models/Ticket");
const Comment = require("../models/Comment");

exports.seed = async (req, res, next) => {
  try {
    // Clear existing data
    await Comment.destroy({ where: {} });
    await Ticket.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Seed users
    const users = await User.bulkCreate(
      [
        {
          lastName: "ClientA",
          firstName: "UserA",
          email: "a@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(111) 111-1111",
          role: "client",
          active: true,
        },
        {
          lastName: "ClientB",
          firstName: "UserB",
          email: "b@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(222) 222-2222",
          role: "client",
          active: true,
        },
        {
          lastName: "Tech1",
          firstName: "User",
          email: "tech1@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(333) 333-3333",
          role: "technicien",
          active: true,
        },
        {
          lastName: "Tech2",
          firstName: "User",
          email: "tech2@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(444) 444-4444",
          role: "technicien",
          active: true,
        },
        {
          lastName: "Admin",
          firstName: "Super",
          email: "admin@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(000) 000-0000",
          role: "admin",
          active: true,
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed categories
    const categories = await Category.bulkCreate(
      [
        {
          name: "Matériel",
          description: "Problèmes liés au matériel informatique",
          active: true,
        },
        {
          name: "Logiciel",
          description: "Problèmes liés aux logiciels",
          active: true,
        },
        {
          name: "Réseau",
          description: "Problèmes de connectivité réseau",
          active: true,
        },
        {
          name: "Sécurité",
          description: "Problèmes de sécurité informatique",
          active: true,
        },
        {
          name: "Autre",
          description: "Autres types de problèmes",
          active: true,
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed tickets
    const tickets = await Ticket.bulkCreate(
      [
        {
          title: "Ordinateur ne démarre pas",
          description: "Mon ordinateur ne veut pas s'allumer ce matin.",
          status: "Ouvert",
          priority: "Haute",
          clientId: users[0].id, // ClientA
          categoryId: categories[0].id, // Matériel
        },
        {
          title: "Logiciel de bureautique plante",
          description: "Word se ferme tout seul après quelques minutes.",
          status: "Assigné",
          priority: "Moyenne",
          clientId: users[0].id,
          technicianId: users[2].id, // Tech1
          categoryId: categories[1].id, // Logiciel
        },
        {
          title: "Connexion internet lente",
          description: "La connexion est très lente depuis hier.",
          status: "En cours",
          priority: "Moyenne",
          clientId: users[1].id, // ClientB
          technicianId: users[3].id, // Tech2
          categoryId: categories[2].id, // Réseau
        },
        {
          title: "Mot de passe oublié",
          description: "Je n'arrive plus à me connecter à mon compte.",
          status: "Résolu",
          priority: "Basse",
          clientId: users[1].id,
          technicianId: users[2].id,
          categoryId: categories[4].id, // Autre
        },
        {
          title: "Virus détecté",
          description: "Antivirus a détecté un virus sur mon poste.",
          status: "Fermé",
          priority: "Critique",
          clientId: users[0].id,
          technicianId: users[3].id,
          categoryId: categories[3].id, // Sécurité
        },
        {
          title: "Imprimante ne fonctionne pas",
          description: "L'imprimante ne répond plus aux commandes.",
          status: "Ouvert",
          priority: "Moyenne",
          clientId: users[1].id,
          categoryId: categories[0].id, // Matériel
        },
        {
          title: "Mise à jour logicielle échoue",
          description: "La mise à jour de Windows échoue à chaque fois.",
          status: "Assigné",
          priority: "Haute",
          clientId: users[0].id,
          technicianId: users[2].id,
          categoryId: categories[1].id, // Logiciel
        },
        {
          title: "Accès au serveur refusé",
          description: "Je ne peux plus accéder au serveur partagé.",
          status: "En attente",
          priority: "Haute",
          clientId: users[1].id,
          technicianId: users[3].id,
          categoryId: categories[2].id, // Réseau
        },
        {
          title: "Email non reçu",
          description: "Je n'ai pas reçu un email important.",
          status: "Résolu",
          priority: "Basse",
          clientId: users[0].id,
          technicianId: users[2].id,
          categoryId: categories[4].id, // Autre
        },
        {
          title: "Clavier défaillant",
          description: "Certaines touches du clavier ne fonctionnent pas.",
          status: "Fermé",
          priority: "Moyenne",
          clientId: users[1].id,
          technicianId: users[3].id,
          categoryId: categories[0].id, // Matériel
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed comments
    await Comment.bulkCreate(
      [
        {
          content: "Pouvez-vous vérifier si l'alimentation est branchée ?",
          type: "public",
          ticketId: tickets[0].id,
          userId: users[2].id, // Tech1
        },
        {
          content:
            "L'alimentation est branchée. Le bouton power ne s'allume même pas.",
          type: "public",
          ticketId: tickets[0].id,
          userId: users[0].id, // ClientA
        },
        {
          content: "J'ai installé une mise à jour corrective pour Word.",
          type: "internal",
          ticketId: tickets[1].id,
          userId: users[2].id,
        },
        {
          content: "Le problème persiste. Word plante toujours.",
          type: "public",
          ticketId: tickets[1].id,
          userId: users[0].id,
        },
        {
          content: "J'ai redémarré le routeur. Testez maintenant.",
          type: "public",
          ticketId: tickets[2].id,
          userId: users[3].id,
        },
        {
          content: "C'est mieux maintenant, merci !",
          type: "public",
          ticketId: tickets[2].id,
          userId: users[1].id,
        },
        {
          content:
            "J'ai réinitialisé votre mot de passe. Utilisez 'TempPass123!' pour vous connecter.",
          type: "internal",
          ticketId: tickets[3].id,
          userId: users[2].id,
        },
        {
          content: "Merci, je peux me connecter maintenant.",
          type: "public",
          ticketId: tickets[3].id,
          userId: users[1].id,
        },
        {
          content: "Virus supprimé. J'ai mis à jour l'antivirus.",
          type: "internal",
          ticketId: tickets[4].id,
          userId: users[3].id,
        },
      ],
      { ignoreDuplicates: true },
    );

    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    next(error);
  }
};
