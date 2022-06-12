import { SlashCommandBuilder } from "@discordjs/builders"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"
import { Client, Intents, MessageActionRow, MessageEmbed, Modal, TextInputComponent } from "discord.js"
import * as fs from "fs"

require("dotenv").config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const TOKEN = process.env.token || ""

const commands = [
  new SlashCommandBuilder().setName("enroll").setDescription("Display all branches"),
  new SlashCommandBuilder().setName("unenroll").setDescription("Unenroll from your current branch"),
]

const roles = ["Competitive Programmer", "Web Developer", "Web Designer", "Data Scientist", "Robotics Engineer"]
const rest = new REST({ version: "9" }).setToken(TOKEN)

const clientId = "983257022751445032"
const guildId = "784324077342031933"

const addRole = (interaction: any, roleName: string) => {
  const role = interaction?.guild?.roles?.cache.find((role: any) => role.name === roleName)
  //@ts-ignore
  role && interaction?.member.roles.add(role)
}

const removeRole = (interaction: any, roleName: string) => {
  const role = interaction?.guild?.roles?.cache.find((role: any) => role.name === roleName)
  //@ts-ignore
  role && interaction?.member.roles.remove(role)
}

const showModal = (interaction: any, branchName: string) => {
  const modal = new Modal().setCustomId("confirm").setTitle("Confirm your action")

  const question = new TextInputComponent()
    .setCustomId("question")
    // The label is the prompt the user sees for this input
    .setLabel("Tell us something..")
    // Short means only a single line of text
    .setStyle("SHORT")
    .setPlaceholder("Type something here..")
    .setRequired(true)

  const warningText = new TextInputComponent()
    .setCustomId("warningText")
    .setLabel("⚠️ Before you're going to confirm (read-only)")
    .setValue(
      "There is multiple branches provided. \nYou can only choose one branch, choose wisely. \n\nₓ ｡ 𐐪₍ᐢ. ̫ .⑅ᐢ₎𐑂↝\n\nNote: Each branches will have their own channel"
    )
    .setStyle("PARAGRAPH")

  const branch = new TextInputComponent()
    .setCustomId("branchName")
    .setLabel("Preferred branch (read-only)")
    .setStyle("SHORT")
    .setMaxLength(100)
    .setPlaceholder(branchName)
    .setValue(branchName)

  //@ts-ignore
  const branchRow = new MessageActionRow().addComponents(branch)
  //@ts-ignore
  const firstActionRow = new MessageActionRow().addComponents(warningText)
  //@ts-ignore
  const secondActionRow = new MessageActionRow().addComponents(question)
  // Add inputs to the modal
  //@ts-ignore
  modal.addComponents(firstActionRow, branchRow, secondActionRow)
  // Show the modal to the user
  interaction.showModal(modal)
}

;(async () => {
  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
})()

client.on("clickButton", async (button) => {
  console.log(button)
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    const id = interaction.customId
    switch (id) {
      case "select_cc":
        showModal(interaction, "Competitive Programming")
        break
      case "select_wd":
        showModal(interaction, "Web Development")
        break
      case "select_ws":
        showModal(interaction, "Web Design")
        break
      case "select_ml":
        showModal(interaction, "Basic Machine Learning")
        break
      case "select_rb":
        showModal(interaction, "Robotic")
        break
    }
  }

  if (interaction.isModalSubmit()) {
    const question = interaction.fields.getTextInputValue("question")
    const bname = interaction.fields.getTextInputValue("branchName")
    addRole(interaction, "Registered")
    switch (bname) {
      case "Competitive Programming":
        addRole(interaction, "Competitive Programmer")
        interaction.deferUpdate()
        break
      case "Web Development":
        addRole(interaction, "Web Developer")
        interaction.deferUpdate()
        break
      case "Web Design":
        addRole(interaction, "Web Designer")
        interaction.deferUpdate()
        break
      case "Basic Machine Learning":
        addRole(interaction, "Data Scientist")
        interaction.deferUpdate()
        break
      case "Robotic":
        addRole(interaction, "Robotics Engineer")
        interaction.deferUpdate()
        break
    }
    fs.appendFileSync(
      "record.txt",
      `${interaction?.member?.user.id}-${interaction?.member?.user.username}-${bname}-${question}\n`
    )
  }

  if (!interaction.isCommand()) return

  if (interaction.commandName === "enroll") {
    interaction.channel?.send({
      components: [
        {
          type: 1,
          components: [
            {
              style: 1,
              label: `Compettitve`,
              custom_id: `select_cc`,
              disabled: false,
              emoji: {
                id: null,
                name: `🧮`,
              },
              type: 2,
            },
            {
              style: 1,
              label: `Web Dev`,
              custom_id: `select_wd`,
              disabled: false,
              emoji: {
                id: null,
                name: `🖥`,
              },
              type: 2,
            },
            {
              style: 1,
              label: `Web Design`,
              custom_id: `select_ws`,
              disabled: false,
              emoji: {
                id: null,
                name: `🖌`,
              },
              type: 2,
            },
            {
              style: 1,
              label: `ML`,
              custom_id: `select_ml`,
              disabled: false,
              emoji: {
                id: null,
                name: `🚀`,
              },
              type: 2,
            },
            {
              style: 1,
              label: `Robotic`,
              custom_id: `select_rb`,
              disabled: false,
              emoji: {
                id: null,
                name: `💡`,
              },
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          title: `Get your preferred role 🐣`,
          description: `There is multiple branches provided. \nYou can only choose one branch, choose wisely. \n\nₓ ｡ 𐐪₍ᐢ. ̫ .⑅ᐢ₎𐑂↝\n\nNote: Each branches will have their own channel `,
          color: 0xf1c8ff,
          fields: [
            {
              name: `🧮 1. Compettitive Programming `,
              value:
                "\u200BA mind sport involving participants trying to program according to provided specifications. Let's code!",
            },
            {
              name: `🖥️ 2. Web Development`,
              value:
                "\u200BEverything about website development from Front-end Development, Back-end Development to Basic Networking and Database Administration",
            },
            {
              name: `🖌️ 3. Web Design`,
              value:
                "\u200BDesign the layout of websites and research about user interactions to develop the best experiences for users using our website.",
            },
            {
              name: `🚀 4. Basic Machine learning`,
              value:
                "\u200BUse scientific methods, processes, algorithms and systems to extract knowledge and insights from noisy, structured and unstructured data.",
            },
            {
              name: `💡 5. Robotic`,
              value:
                "\u200BFrom arduino boards to raspberry pis, design and create machines that can help and assist humans.",
            },
          ],
          footer: {
            text: `\nHo ho.. React on emoji below to collect your role !`,
          },
        },
      ],
    })
  }

  if (interaction.commandName === "unenroll") {
    //@ts-ignore
    if (!interaction?.member?.roles.cache.find((r: any) => r.name === "Registered")) {
      interaction.reply("Aww.. We are not able to perform this action.")
      return
    }

    roles.forEach((r) => {
      removeRole(interaction, r)
    })
    removeRole(interaction, "Registered")
    interaction.reply("Bye bye 👋🥹")
  }
})

client.login(TOKEN)
