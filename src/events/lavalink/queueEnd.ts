import { ButtonBuilder, ButtonStyle, Colors, ContainerBuilder, MessageFlags, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import { CustomClient } from "../../types/bot_classes";
import { Player } from "lavalink-client";

export default {
    name: "queueEnd",
    async execute(Client: CustomClient, player: Player) {
		if (!player.textChannelId) return;
		const channel = Client.channels.cache.get(player.textChannelId);

		const container = new ContainerBuilder();
		container.setAccentColor(Colors.Red);
		container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
			"### Queue ended!",
			"Leaving VC if another song is not played in 2 minutes."
		].join("\n")));

		container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

		const replayButton = new ButtonBuilder();
		replayButton.setLabel("Replay last song");
		replayButton.setEmoji("🔁");
		replayButton.setStyle(ButtonStyle.Secondary);
		replayButton.setCustomId("replay");
		
		container.addActionRowComponents(row => row.addComponents(replayButton));

		if (channel && channel.isSendable()) {
			const message = await channel.send({ 
				components: [container],
				flags: MessageFlags.IsComponentsV2
			});

			const collector = message.createMessageComponentCollector({ time: 120_000 });

			collector.on("collect", async () => {
				const previous = await player.queue.shiftPrevious();
				if (previous) {
					if (player.queue.current) await player.queue.add(player.queue.current, 0);
					await player.play({ clientTrack: previous });
				}
				await message.delete();
			});
		}
    },
};
