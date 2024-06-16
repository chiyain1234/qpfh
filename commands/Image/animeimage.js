const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require('discord.js');
const booru = require('booru');
const axios = require('axios');
const cmdName = "animeimage";

const subcommandData1 = {
    "gotiusa": { name: "ご注文はうさぎですか?", word: "gochuumon_wa_usagi_desu_ka?" },
    "miku": { name: "初音ミク", word: "hatsune_miku" },
    "rizero": { name: "Re:ゼロから始める異世界生活", word: "re:zero_kara_hajimeru_isekai_seikatsu" },
    "hololive": { name: "ホロライブ", word: "hololive" },
    "oshinoko": { name: "推しの子", word: "oshi_no_ko" },
    "bocchi": { name: "ぼっち・ざ・ろっく!", word: "bocchi_the_rock!" },
    "konosuba": { name: "この素晴らしい世界に祝福を！", word: "kono_subarashii_sekai_ni_shukufuku_wo!" },
    "gotoubun": { name: "五等分の花嫁", word: "go-toubun_no_hanayome" },
    "kaguya": { name: "かぐや様は告らせたい", word: "kaguya-sama_wa_kokurasetai_~tensai-tachi_no_renai_zunousen~" },
    "lycoris": { name: "リコリス・リコイル", word: "lycoris_recoil" },
    "index": { name: "とある魔術の禁書目録", word: "toaru_majutsu_no_index" },
    "elaina": { name: "イレイナ(魔女の旅々)", word: "elaina_(majo_no_tabitabi)" },
    "kanojo": { name: "彼女、お借りします", word: "kanojo_okarishimasu" },
    "lovelive": { name: "ラブライブ！", word: "love_live!" }
};

const subcommandData2 = {
    "touhou": { name: "東方", word: "touhou" },
    "genshin": { name: "原神", word: "genshin_impact" },
    "umamusume": { name: "ウマ娘", word: "umamusume" },
    "pokemon": { name: "ポケモン", word: "pokemon" },
    "proseka": { name: "プロジェクトセカイ", word: "project_sekai" },
    "splatoon": { name: "スプラトゥーン", word: "splatoon_(series) !" },
    "blue_archive": { name: "ブルーアーカイブ", word: "blue_archive" },
    "kantai_collection": { name: "艦隊これくしょん", word: "kantai_collection" },
    "princess_connect": { name: "プリンセスコネクト！", word: "princess_connect!" },
    "nikke": { name: "勝利の女神:NIKKE", word: "goddess_of_victory:_nikke" },
    "starrail": { name: "崩壊:スターレイル", word: "honkai:_star_rail" },
    "azur_lane": { name: "アズールレーン", word: "azur_lane" },
};

const subcommandData3 = {
    "awoo": { name: 'Awoo', word: 'awoo' },
    "blush": { name: 'Blush', word: 'blush' },
    "bully": { name: 'Bully', word: 'bully' },
    "cuddle": { name: 'Cuddle', word: 'cuddle' },
    "cringe": { name: 'Cringe', word: 'cringe' },
    "cry": { name: 'Cry', word: 'cry' },
    "happy": { name: 'Happy', word: 'happy' },
    "pat": { name: 'Pat', word: 'pat' },
    "poke": { name: 'Poke', word: 'poke' },
    "smile": { name: 'Smile', word: 'smile' },
    "smug": { name: 'Smug', word: 'smug' },
    "yeet": { name: 'Yeet', word: 'yeet' },
    "wink": { name: 'Wink', word: 'wink' },
};

const subcommandData4 = {
    bonk: { name: 'Bonk', word: 'bonk' },
    bite: { name: 'Bite', word: 'bite' },
    dance: { name: 'Dance', word: 'dance' },
    handhold: { name: 'Handhold', word: 'handhold' },
    highfive: { name: 'Highfive', word: 'highfive' },
    hug: { name: 'Hug', word: 'hug' },
    kick: { name: 'Kick', word: 'kick' },
    kill: { name: 'Kill', word: 'kill' },
    kiss: { name: 'Kiss', word: 'kiss' },
    lick: { name: 'Lick', word: 'lick' },
    nom: { name: 'Nom', word: 'nom' },
    slap: { name: 'Slap', word: 'slap' },
    wave: { name: 'Wave', word: 'wave' },
};

const subcommandData5 = {
    "neko": { name: "猫耳", word: "cat_ears" },
    "kemo": { name: "ケモ耳", word: "animal_ears" },
    "long": { name: "ロングヘア", word: "long_hair" },
    "verylong": { name: "ベリーロングヘア", word: "very_long_hair" },
    "short": { name: "ショートヘア", word: "short_hair" },
    "veryshort": { name: "ベリーショートヘア", word: "very_short_hair" },
    "bob": { name: "ボブカット", word: "bob_cut" },
    "hime": { name: "姫カット", word: "hime_cut" },
    "halfup": { name: "ハーフアップ", word: "half_updo" },
    "curly": { name: "カーリーヘア", word: "curly_hair" },
    "wavy": { name: "ウェイビーヘア", word: "wavy_hair" },
    "medium": { name: "ミディアムヘア", word: "medium_hair" },
    "straight": { name: "ストレートヘア", word: "straight_hair" },
    "ponytail": { name: "ポニーテール", word: "ponytail" },
    "twintails": { name: "ツインテール", word: "twintails" },
    "drill": { name: "ドリルヘア", word: "drill_hair" },
    "bun": { name: "お団子", word: "hair_bun" },
    "braid": { name: "三つ編み", word: "braid" },
    "tentacle": { name: "触手", word: "tentacle_hair" },
    "ahoge": { name: "あほ毛", word: "ahoge" },
};

const subcommandData6 = {
    "uniform": { name: "制服", word: "school_uniform" },
    "swimsuit": { name: "水着", word: "swimsuit" },
    "dress": { name: "ドレス", word: "dress" },
    "maid": { name: "メイド服", word: "maid" },
    "shirt": { name: "シャツ", word: "shirt" },
    "kimono": { name: "着物", word: "kimono" },
    "tank_top": { name: "タンクトップ", word: "tank_top" },
    "suit": { name: "スーツ", word: "suit" },
    "hoodie": { name: "パーカー", word: "hoodie" },
    "coat": { name: "コート", word: "coat" },
    "sweater": { name: "セーター", word: "sweater" },
    "apron": { name: "エプロン", word: "apron" },
    "pajamas": { name: "パジャマ", word: "pajamas" },
    "yukata": { name: "浴衣", word: "yukata" },
    "nurse": { name: "ナース", word: "nurse" },
    "cheerleader": { name: "チアリーダー", word: "cheerleader" },
    "china_dress": { name: "チャイナドレス", word: "china_dress" },
    "gothic_lolita": { name: "ゴスロリ", word: "gothic_lolita " },
    "miko": { name: "巫女", word: "miko " },
    "leotard": { name: "レオタード", word: "leotard" },
    "rabbit_girl": { name: "バニーガール", word: "rabbit_girl" },
    "cardigan": { name: "カーディガン", word: "cardigan" },
    "blouse": { name: "ブラウス", word: "blouse" },
    "santa_costume": { name: "サンタ", word: "santa_costume" },
    "halloween_costume": { name: "ハロウィン", word: "halloween_costume" },
};

const subcommandData7 = {
    "glasses": { name: "眼鏡", word: "glasses" },
    "brown": { name: "褐色", word: "dark_skin" },
    "child": { name: "ロリ(健全)", word: "child" },
    "yandere": { name: "ヤンデレ", word: "yandere" },
    "otokonoko": { name: "男の娘", word: "otoko_no_ko" },
};
const subcommandData8 = {
    "black": { name: "黒髪", word: "black_hair" },
    "brown": { name: "茶髪", word: "brown_hair" },
    "light_brown": { name: "淡茶髪", word: "light_brown_hair" },
    "dark_brown": { name: "濃茶髪", word: "black_brown_hair" },
    "blonde": { name: "金髪", word: "blonde_hair" },
    "yellow": { name: "黄色髪", word: "yellow_hair" },
    "orange": { name: "オレンジ髪", word: "orange_hair" },
    "copper": { name: "銅髪", word: "copper_hair" },
    "red": { name: "赤髪", word: "red_hair" },
    "pink": { name: "ピンク髪", word: "pink_hair" },
    "purple": { name: "紫髪", word: "purple_hair" },
    "blue": { name: "青髪", word: "blue_hair" },
    "green": { name: "緑髪", word: "green_hair" },
    "grey": { name: "灰色髪", word: "grey_hair" },
    "light_blue": { name: "淡青髪", word: "light_blue_hair" },
    "light_purple": { name: "淡紫髪", word: "light_purple_hair" },
    "silver": { name: "銀髪", word: "silver_hair" },
    "white": { name: "白髪", word: "white_hair" },
    "rainbow": { name: "虹色髪", word: "rainbow_hair" }
};


const commandBuilder = new SlashCommandBuilder()
    .setName(cmdName)
    .setDescription("2次元キャラの画像を取得する。")
    .addSubcommandGroup(group => {
        const animeGroup = group
            .setName('anime')
            .setDescription('アニメキャラクターの画像を取得する。');

        for (const [key1, { name }] of Object.entries(subcommandData1)) {
            animeGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key1)
                .setDescription(`${name}の画像を表示する。`)
                .addBooleanOption(option => option
                    .setName('nsfw')
                    .setDescription('NSFW画像にしますか？')
                    .setRequired(false))

            );
        }
        return animeGroup;
    })
    .addSubcommandGroup(group => {
        const gameGroup = group
            .setName('game')
            .setDescription('ゲームキャラクターの画像を取得する。');

        for (const [key2, { name }] of Object.entries(subcommandData2)) {
            gameGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key2)
                .setDescription(`${name}の画像を表示する。`)
                .addBooleanOption(option => option
                    .setName('nsfw')
                    .setDescription('NSFW画像にしますか？')
                    .setRequired(false))
            );
        }
        return gameGroup;
    })
    .addSubcommandGroup(group => {
        const emotionGroup = group
            .setName('emotion')
            .setDescription('アニメキャラクターのエモーション画像を取得する。');

        for (const [key2, { name }] of Object.entries(subcommandData3)) {
            emotionGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key2)
                .setDescription(`${name}の画像を表示する。`)
            );
        }
        return emotionGroup;
    })
    .addSubcommandGroup(group => {
        const motionGroup = group
            .setName('motion')
            .setDescription('アニメキャラクターのモーション画像を取得する。');

        for (const [key2, { name }] of Object.entries(subcommandData4)) {
            motionGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key2)
                .setDescription(`${name}の画像を表示する。`)
            );
        }
        return motionGroup;
    })
    .addSubcommandGroup(group => {
        const hairGroup = group
            .setName('hair')
            .setDescription('指定した髪の子の画像を取得する。');

        for (const [key2, { name }] of Object.entries(subcommandData5)) {
            hairGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key2)
                .setDescription(`${name}の画像を表示する。`)
                .addBooleanOption(option => option
                    .setName('nsfw')
                    .setDescription('NSFW画像にしますか？')
                    .setRequired(false))
            );
        }
        return hairGroup;
    })
    .addSubcommandGroup(group => {
        const clothingGroup = group
            .setName('clothing')
            .setDescription('指定した服装の子の画像を取得する。');

        for (const [key2, { name }] of Object.entries(subcommandData6)) {
            clothingGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key2)
                .setDescription(`${name}の画像を表示する。`)
                .addBooleanOption(option => option
                    .setName('nsfw')
                    .setDescription('NSFW画像にしますか？')
                    .setRequired(false))
            );
        }
        return clothingGroup;
    })
    .addSubcommandGroup(group => {
        const styleGroup = group
            .setName('style')
            .setDescription('指定したスタイルの子の画像を取得する。');

        for (const [key2, { name }] of Object.entries(subcommandData7)) {
            styleGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key2)
                .setDescription(`${name}の画像を表示する。`)
                .addBooleanOption(option => option
                    .setName('nsfw')
                    .setDescription('NSFW画像にしますか？')
                    .setRequired(false))
            );
        }
        return styleGroup;
    })
    .addSubcommandGroup(group => {
        const haircolorGroup = group
            .setName('haircolor')
            .setDescription('指定した髪色の子の画像を取得する。');

        for (const [key2, { name }] of Object.entries(subcommandData8)) {
            haircolorGroup.addSubcommand(subcommand =>
                subcommand
                .setName(key2)
                .setDescription(`${name}の画像を表示する。`)
                .addBooleanOption(option => option
                    .setName('nsfw')
                    .setDescription('NSFW画像にしますか？')
                    .setRequired(false))
            );
        }
        return haircolorGroup;
    })

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 8,
    data: commandBuilder,

    async execute(interaction, client) {
        await interaction.deferReply();
        const group = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        const nsfw = interaction.options.getBoolean('nsfw') || false;
        const database = nsfw === true ? "db" : "sb";

        if (nsfw === true && !interaction.channel.nsfw) {
            const errorEmbed = new MessageEmbed()
                .setTitle("エラー")
                .setDescription("NSFWチャンネルではないので、このコマンドは使用できません。")
                .setColor("RED")
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp()
                .setFooter({ text: interaction.toString() });
            await interaction.editReply({ embeds: [errorEmbed] });
            return false;
        }

        if (group === "hair" || group === "haircolor" || group === "clothing" || group === "style") {
            try {
            const cmd = group === 'hair' ? subcommandData5 :
                group === 'clothing' ? subcommandData6 :
                group === 'style' ? subcommandData7 :
                subcommandData8;
            const { name, word } = cmd[subcommand] || {};
                 booru.search(database, [word], { nsfw: nsfw, random: true }).then(images => {
                    if (images.length > 0) {
                        const image = images[0].file_url;
                        const attachment = new MessageAttachment(image, 'anime.png');
                        const embed = new MessageEmbed()
                            .setColor(client.config.color)
                            .setTitle(`${name}`)
                            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
                            .setImage('attachment://anime.png')
                            .setTimestamp()
                            .setFooter({ text: interaction.toString(), iconURL: '' });

                        interaction.editReply({ embeds: [embed], files: [attachment] });
                    } else {
                        interaction.editReply("画像が見つかりませんでした。\nもう一度お試しください。");
                    }
                })
        } catch (error) {
            interaction.editReply("画像の検索中にエラーが発生しました。");
        }
    }


       else if (group === "emotion" || group === "motion") {
            const subcommandGroup = interaction.options.getSubcommandGroup();
            const subcommand = interaction.options.getSubcommand();

            const type = subcommandGroup === 'emotion' ? subcommand : subcommand;

            const getUni = async (type) => {
                const response = await axios.get(`https://api.waifu.pics/sfw/${type}`);
                return response.data;
            };

            const uniValue = await getUni(type);
            const image = uniValue.url;

            try {
                const attachment = new MessageAttachment(image, 'react.gif');
                const embed = new MessageEmbed()
                    .setColor(client.config.color)
                    .setDescription(`_${interaction.user.username} ${type}es_`)
                    .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
                    .setImage('attachment://react.gif')
                    .setTimestamp()
                    .setFooter({ text: interaction.toString(), iconURL: '' });

                await interaction.editReply({ embeds: [embed], files: [attachment] });
            } catch (error) {
                console.error('Error sending image:', error);
                interaction.editReply("画像の送信中にエラーが発生しました。");
            }
        } 
        
        else {
            try {
                const cmd = group === 'anime' ? subcommandData1 : subcommandData2;
                const { name, word } = cmd[subcommand] || {};

                    booru.search(database, [word], { nsfw: nsfw, random: true }).then(images => {
                        if (images.length > 0) {
                            const image = images[0].file_url;
                            const attachment = new MessageAttachment(image, 'character.png');
                            const embed = new MessageEmbed()
                                .setColor(client.config.color)
                                .setTitle(`${name}`)
                                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
                                .setImage('attachment://character.png')
                                .setTimestamp()
                                .setFooter({ text: interaction.toString(), iconURL: '' });

                            interaction.editReply({ embeds: [embed], files: [attachment] });
                        } else {
                            interaction.editReply("画像が見つかりませんでした。\nもう一度お試しください。");
                        }
                    })
            } catch (error) {
                interaction.editReply("画像の検索中にエラーが発生しました。");
            }
        }
    }
};