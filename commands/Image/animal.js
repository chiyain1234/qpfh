const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios');
const cmdName = "animal";
const nodeFetch = require('node-fetch');  // Add this line to polyfill fetch
const accessKey = process.env.UNSPLASH_API_KEY
const { createApi } = require('unsplash-js');

// Unsplash APIキー
const unsplash = createApi({
    accessKey: accessKey,
    fetch: nodeFetch,
});


const animalData = {
    carnivores: [
        { name: 'ライオン', value: 'lion' },
        { name: 'トラ', value: 'tiger' },
        { name: 'クマ', value: 'bear' },
        { name: 'ヒョウ', value: 'leopard' },
        { name: 'ヤマネコ', value: 'lynx' },
        { name: 'チーター', value: 'cheetah' },
        { name: 'ハイエナ', value: 'hyena' },
        { name: 'ジャガー', value: 'jaguar' },
        { name: 'シロクマ', value: 'polar-bear' },
        { name: 'シカ', value: 'stag' },
        { name: 'ワニガメ', value: 'alligator-snapping-turtle' },
        { name: 'カメレオン', value: 'chameleon' },
        { name: 'カバンドウ', value: 'gavial' },
        { name: 'フェネック', value: 'fennec-fox' },
        { name: 'グリズリー', value: 'grizzly-bear' },
        { name: 'ジャイアントパンダ', value: 'giant-panda' },
        { name: 'シャンパンザン', value: 'bonobo' },
        { name: 'アライグマ', value: 'raccoon' },
        { name: 'シロクロサイ', value: 'white-rhinoceros' },
        { name: 'ゴールデンレトリーバー', value: 'golden-retriever' },
        { name: 'アンテアトルス', value: 'anteater' },
        { name: 'タスマニアンデビル', value: 'tasmanian-devil' },
    ],
    herbivores: [
        { name: 'ウサギ', value: 'rabbit' },
        { name: '馬', value: 'horse' },
        { name: 'キツネ', value: 'fox' },
        { name: '鹿', value: 'deer' },
        { name: 'ゾウ', value: 'elephant' },
        { name: 'パンダ', value: 'panda' },
        { name: 'コアラ', value: 'koala' },
        { name: 'カバ', value: 'hippo' },
        { name: 'ナマケモノ', value: 'sloth' },
        { name: 'ヤギ', value: 'goat' },
        { name: 'カンガルー', value: 'kangaroo' },
        { name: 'ラバー', value: 'llama' },
        { name: 'シマウマ', value: 'zebra' },
        { name: 'キリン', value: 'giraffe' },
        { name: '羊', value: 'sheep' },
        { name: 'ヤク', value: 'yak' },
        { name: 'アルパカ', value: 'alpaca' },
        { name: 'バク', value: 'tapir' },
        { name: 'バッファロー', value: 'buffalo' },
        { name: 'アリクイ', value: 'anteater' },
        { name: 'マントヒヒ', value: 'baboon' },
        { name: 'サイ', value: 'rhinoceros' },
        { name: 'マングース', value: 'mongoose' }
    ],
    primates: [
        { name: 'サル', value: 'monkey' },
        { name: 'ゴリラ', value: 'gorilla' },
        { name: 'チンパンジー', value: 'chimpanzee' },
        { name: 'オランウータン', value: 'orangutan' }
    ],
    rodents: [
        { name: 'ネズミ', value: 'mouse' },
        { name: 'リス', value: 'squirrel' },
        { name: 'モルモット', value: 'guinea-pig' }
    ],
    carnivorous_marsupials: [
        { name: 'カンガルー', value: 'kangaroo' },
        { name: 'タスマニアデビル', value: 'tasmanian-devil' }
    ],
    other_mammals: [
        { name: 'アルマジロ', value: 'armadillo' },
        { name: 'バッファロー', value: 'buffalo' },
        { name: 'ビーバー', value: 'beaver' },
        { name: 'ラクダ', value: 'camel' },
        { name: '牛', value: 'cow' },
        { name: '豚', value: 'pig' },
        { name: 'ザイーガ', value: 'saiga' },
        { name: 'ラッコ', value: 'otter' },
        { name: 'モモンガ', value: 'flying-squirrel' },
        { name: 'ノネズミ', value: 'rat' },
        { name: 'イタチ', value: 'weasel' },
        { name: 'カバンドウ', value: 'gavial' },
        { name: 'キンクジラ', value: 'dugong' },
        { name: 'ワラビー', value: 'wallaby' },
        { name: 'ホッキョクギツネ', value: 'arctic-fox' },
        { name: 'ケンタウロス', value: 'centaur' },
        { name: 'セイウチ', value: 'walrus' },
        { name: 'アシカ', value: 'sea-lion' },
        { name: 'ゾウガメ', value: 'giant-tortoise' },
        { name: 'オオカミ', value: 'wolf' },
        { name: 'イヌ', value: 'dog' },
        { name: 'ネコ', value: 'cat' },

    ],
    bird: [
        { name: '鳥', value: 'bird' },
        { name: 'ペンギン', value: 'penguin' },
        { name: 'フクロウ', value: 'owl' },
        { name: 'ワシ', value: 'eagle' },
        { name: 'タカ', value: 'hawk' },
        { name: 'ハヤブサ', value: 'falcon' },
        { name: 'スズメ', value: 'sparrow' },
        { name: 'カラス', value: 'crow' },
        { name: 'ハト', value: 'pigeon' },
        { name: 'カモメ', value: 'seagull' },
        { name: 'ツバメ', value: 'swallow' },
        { name: 'ハチドリ', value: 'hummingbird' },
        { name: 'アヒル', value: 'duck' },
        { name: 'ガチョウ', value: 'goose' },
        { name: '白鳥', value: 'swan' },
        { name: 'インコ', value: 'parakeet' },
        { name: 'オウム', value: 'parrot' },
        { name: 'フラミンゴ', value: 'flamingo' },
        { name: 'キツツキ', value: 'woodpecker' },
    ],
    reptile: [
        { name: 'カメ', value: 'turtle' },
        { name: 'ワニ', value: 'crocodile' },
        { name: 'トカゲ', value: 'lizard' },
        { name: 'ヘビ', value: 'snake' },
        { name: 'イグアナ', value: 'iguana' },
        { name: 'カメレオン', value: 'chameleon' },
        { name: 'アリゲーター', value: 'alligator' },
        { name: 'ワニガメ', value: 'alligator-snapping-turtle' },
        { name: 'ハリガネガメ', value: 'armored-sea-turtle' },
        { name: 'ヤマカガシ', value: 'horned-lizard' }
    ],
    amphibian: [
        { name: 'カエル', value: 'frog' },
        { name: 'サンショウウオ', value: 'salamander' },
        { name: 'イモリ', value: 'newt' },
        { name: 'アホロートル', value: 'axolotl' }
    ],
    fish: [
        { name: '金魚', value: 'goldfish' },
        { name: 'サメ', value: 'shark' },
        { name: 'マグロ', value: 'tuna' },
        { name: 'タツノオトシゴ', value: 'seahorse' },
        { name: 'イルカ', value: 'dolphin' },
        { name: 'クジラ', value: 'whale' },
        { name: 'カキ', value: 'oyster' },
        { name: 'ヒラメ', value: 'flounder' },
        { name: 'エイ', value: 'ray' },
        { name: 'ウナギ', value: 'eel' },
        { name: 'フグ', value: 'blowfish' },
        { name: 'カニ', value: 'crab' },
        { name: 'エビ', value: 'shrimp' },
        { name: 'イカ', value: 'squid' },
        { name: 'タコ', value: 'octopus' },
        { name: 'タイ', value: 'sea-bream' },
        { name: 'クロダイ', value: 'black-porgy' },
        { name: 'マダイ', value: 'red-seabream' },
        { name: 'ホウボウ', value: 'flying-gurnard' },
        { name: 'コイ', value: 'carp' },
        { name: 'ナマズ', value: 'catfish' },
        { name: 'ハタハタ', value: 'sandfish' },
        { name: 'クサフグ', value: 'grass-puffer' },
        { name: 'マンボウ', value: 'mola-mola' },
        { name: 'マンタ', value: 'manta-ray' }
    ],
    insect: [
        { name: '蝶', value: 'butterfly' },
        { name: 'ハチ', value: 'bee' },
        { name: 'アリ', value: 'ant' },
        { name: 'カブトムシ', value: 'beetle' },
        { name: 'カマキリ', value: 'mantis' },
        { name: 'ハエ', value: 'fly' },
        { name: 'ゴキブリ', value: 'cockroach' },
        { name: 'バッタ', value: 'grasshopper' },
        { name: 'カ', value: 'mosquito' },
        { name: 'セミ', value: 'cicada' },
        { name: 'トンボ', value: 'dragonfly' },
        { name: 'クワガタムシ', value: 'stag-beetle' },
        { name: 'テントウムシ', value: 'ladybug' },
        { name: 'シロアリ', value: 'termite' },
        { name: 'ホタル', value: 'firefly' },
        { name: 'アブ', value: 'horsefly' },
        { name: 'クモ', value: 'spider' },
        { name: 'コオロギ', value: 'cricket' },
        { name: 'カタツムリ', value: 'snail' },
        { name: 'ヤドカリ', value: 'hermit-crab' },
        { name: 'サソリ', value: 'scorpion' },
        { name: 'ミツバチ', value: 'wasp' },
    ],
    marine: [
        { name: 'クジラ', value: 'whale' },
        { name: 'イルカ', value: 'dolphin' },
        { name: 'アザラシ', value: 'seal' },
        { name: 'クラゲ', value: 'jellyfish' },
        { name: 'カニ', value: 'crab' },
        { name: 'エビ', value: 'shrimp' },
        { name: 'イカ', value: 'squid' },
        { name: 'タコ', value: 'octopus' },
        { name: 'タイ', value: 'sea-bream' },
        { name: 'ヒラメ', value: 'flounder' },
        { name: 'カキ', value: 'oyster' },
        { name: 'エイ', value: 'ray' },
        { name: 'ウナギ', value: 'eel' },
        { name: 'フグ', value: 'blowfish' },
        { name: 'タツノオトシゴ', value: 'seahorse' },
        { name: 'マンボウ', value: 'mola-mola' },
        { name: 'マンタ', value: 'manta-ray' }
    ],
    mythical: [
        { name: 'ドラゴン', value: 'dragon' },
        { name: 'ユニコーン', value: 'unicorn' },
        { name: 'フェニックス', value: 'phoenix' },
        { name: 'グリフォン', value: 'griffin' },
        { name: 'キマイラ', value: 'chimera' },
        { name: 'スフィンクス', value: 'sphinx' },
        { name: 'ミノタウロス', value: 'minotaur' },
        { name: 'キュクロプス', value: 'cyclops' },
        { name: 'リヴァイアサン', value: 'leviathan' },
        { name: 'サラマンダー', value: 'salamander' },
    ],

    other: [
        { name: '細菌', value: 'germ' },
        { name: '微生物', value: 'microorganisms' },
        { name: 'ウイルス', value: 'virus' },
    ]
};

const commandBuilder = new SlashCommandBuilder()
    .setName(cmdName)
    .setDescription("動物の画像を取得する。");

for (const [group, animals] of Object.entries(animalData)) {
    commandBuilder.addSubcommandGroup(groupBuilder => {
        const groupCommand = groupBuilder
            .setName(group)
            .setDescription(`${group}の画像を取得する。`);

        for (const { name, value } of animals) {
            groupCommand.addSubcommand(subcommand =>
                subcommand
                    .setName(value)
                    .setDescription(`${name}の画像を表示する。`)
            );
        }
        return groupCommand;
    });
}

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    cooldown: 8,
    data: commandBuilder,

    async execute(interaction, client) {
        await interaction.deferReply();
        try {
            const subcommand = interaction.options.getSubcommand();
            const group = interaction.options.getSubcommandGroup();
            const cmdGroup = animalData[group];
            const { name, value } = cmdGroup.find(animal => animal.value === subcommand) || {};
            const result = await unsplash.search.getPhotos({ query: subcommand, perPage: 100  });
            const images = result.response.results
                    // ランダムなインデックスを生成
                    const randomIndex = Math.floor(Math.random() * images.length);
            
   // ランダムなインデックスに対応する画像を選択
            const selectedImage = images[randomIndex];
            const imageUrl = selectedImage.urls.regular;
            const photographerName = selectedImage.user.name; // 写真家のフルネームを取得
            const photographerProfile = selectedImage.user.links.html; // 写真家のプロフィールURLを取得
            const downloadLocation = selectedImage.links.download_location; // ダウンロードURLを取得

            // ダウンロードをトリガーするリクエスト
            await axios.get(`${downloadLocation}?client_id=${accessKey}`);
            
            const utmParams = 'utm_source=TanTan&utm_medium=discord&utm_campaign=imageRequest';
            const imageUrlWithUTM = `${imageUrl}?${utmParams}`;
            const photographerProfileWithUTM = `${photographerProfile}?${utmParams}`;

            const attachment = new MessageAttachment(imageUrlWithUTM, `${subcommand}.png`);
            
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`${value}`)
                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: '' })
                .setImage(`attachment://${subcommand}.png`)
                .addFields(
                    { name: "Author", value: `[${photographerName}](${photographerProfileWithUTM})` },
                    { name: "Image", value: `[URL](${imageUrlWithUTM})` }
                )
                .setTimestamp()
                .setFooter({ text: `Powered by Unsplash`, iconURL: '' });
            
            await interaction.editReply({ embeds: [embed], files: [attachment] });
            
        } catch (error) {
            console.error(error);
            await interaction.editReply("画像の検索中にエラーが発生しました。");
        }
    }
};