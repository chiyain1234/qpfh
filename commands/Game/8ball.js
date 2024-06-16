const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

const cmdName = "8ball"

module.exports = {
    guildOnly: false,
    adminGuildOnly: false,
    data: new SlashCommandSubcommandBuilder()
        .setName(cmdName)
        .setDescription("あなたの質問に答える。")
        .addStringOption(option => option.setName('text')
            .setDescription('テキストを入力してください。')
            .setRequired(true)),


    async execute(i, client) {
        const text = i.options.getString('text');

        let suki = /好き|好き|すき|嫌い|きらい|好き|好き|すき|嫌い|きらい/;
        let suki2 = /^好き$|^すき$/
        let select = /どっちが好き|どっちがすき/;
        let sukinatabemono = /好きな食べ物|すきなたべもの|好きなたべもの|すきな食べ物|好きな食べもの|好きな食べもの/;
        let sukinakyoku = /好きな曲|すきなきょく|好きなきょく|すきな曲/;
        let seibetu = /性別は何|性別はなに/;
        let morate = /貰って|もらって/;
        let english = /^[a-zA-Z0-9]+$/;
        let ya = /やあ|やぁ|ヤァ|ヤア|ya/;
        let ohayo = /おはよう|オハヨウ|ohayo/;
        let oyasumi = /おやすみ|オヤスミ|oyasu/;
        let kon = /こんにちは|コンニチハ/
        let kons = /^こん$|^コン$/
        let sitteru = /しってる|知ってる/
        let desuka = /ですか|デスカ/
        let yaho = /やほ|やっほ|ヤホ|ヤッホ/
        let simoneta = /ちんちん|チンチン|愛液|青姦|赤マン|朝立チ|麻縄|足コキ|アダルトビデオ|圧迫系プレイ|アナルバイブ|アナルビーズ|アナルファック|アナルフィスト|アナルプラグ|アニリングス|編ミ鞭|蟻ノ門渡リ|異常性欲|イチヂク浣腸|一本鞭|イメージプレイ|イラマチオ|医療系プレイ|飲尿|陰部|陰毛|ウェット＆メッシー|裏本|エイジプレイ|SM|SMクラブ|S男|エネマグラ|M女|援助交際|オーガズム|オーラルセックス|オ掃除フェラ|オチンチン|オッパイ|オナニー|オナホール|オ姉系|オムツプレイ|カーセックス|回春マッサージ|拡張プレイ|仮性包茎|カテーテル|ガマン汁|顔射|浣腸|浣腸プレイ|顔面騎乗|騎乗位|強制放尿|巨根|巨乳|金蹴リ|緊縛|クスコ|口枷|屈曲位|クリップ責メ|クリトリス|クンニリングス|ゴ挨拶プレイ|強姦|後戯|交差位|拘束具|口内射精|肛内射精|後背位|肛門|コスプレ|言葉責メ|コンドーム|ザーメン|座位|サディズム|三角木馬|サンドイッチファック|３Ｐ|Gスポット|潮吹キ|四十八手|失禁|シックスナイン|射精|手淫|獣姦|熟女|正太郎コンプレックス|女装プレイ|シリンダー浣腸器|真性包茎|スカトロジー|ストーリープレイ|スパンキング|素股|スワッピング|精飲|精液|性具|性行為|性交体位|正常位|性的興奮|性的嗜好|性的倒錯|性的ロールプレイ|セックス|前戯|前立腺|早漏|側位|ソフトSM|ダッチワイフ|痴漢|痴女|膣外射精|膣内射精|膣分泌液|調教|遅漏|チングリ返シ|ちんこ|チンコ|ちんぽ|チンポ|ディープ・スロート|剃毛プレイ|ディルド|デブ専|手マン|テレフォンクラブ|電マ|トコロテン|ドライオーガズム|奴隷|中出シ|縄師|ナンパ|仁王立|フェラ|肉便器|偽乳|ニューハーフ|乳輪|妊娠線|ノーズプレイ|ノンケ|ハードSM|パイズリ|パイパン|ハイヒール責メ|バイブレータ|ハメ撮リ|バラ鞭|針責メ|パンスト破リ|BDSM|人妻|ピル|ヒルドイド|貧乳|フィストファック|風営法|フェチ|フェラチオ|不感症|腹射|二股|ブッカケ|ペッティング|ペニスバンド|放置プレイ|放尿|勃起|勃起不全|ボンデージ|マゾヒズム|マルキ・ド・サド|マングリ返シ|マンコ|夢精|鞭打チ|胸射|名器|メイルレイプ|目隠シプレイ|メル友|綿ロープ|野外プレイ|ユルマン|幼児プレイ|横恋慕|夜這イ|４Ｐ|乱交|立位|陵辱|輪姦|蝋燭|ローションプレイ|露出プレイ|猥褻|和姦|愛液|青姦|赤まん|朝立ち|麻縄|足こき|あだるとびでお|圧迫系ぷれい|あなるばいぶ|あなるびーず|あなるふぁっく|あなるふぃすと|あなるぷらぐ|あにりんぐす|編み鞭|蟻の門渡り|異常性欲|いちぢく浣腸|一本鞭|いめーじぷれい|いらまちお|医療系ぷれい|飲尿|陰部|陰毛|うぇっと＆めっしー|裏本|えいじぷれい|SM|SMくらぶ|S男|えねまぐら|M女|援助交際|おーがずむ|おーらるせっくす|お掃除ふぇら|おちんちん|おっぱい|おなにー|おなほーる|お姉系|おむつぷれい|かーせっくす|回春まっさーじ|拡張ぷれい|仮性包茎|かてーてる|がまん汁|顔射|浣腸|浣腸ぷれい|顔面騎乗|騎乗位|強制放尿|巨根|巨乳|金蹴り|緊縛|くすこ|口枷|屈曲位|くりっぷ責め|くりとりす|くんにりんぐす|ご挨拶ぷれい|強姦|後戯|交差位|拘束具|口内射精|肛内射精|後背位|肛門|こすぷれ|言葉責め|こんどーむ|ざーめん|座位|さでぃずむ|三角木馬|さんどいっちふぁっく|３Ｐ|Gすぽっと|潮吹き|四十八手|失禁|しっくすないん|射精|手淫|獣姦|熟女|正太郎こんぷれっくす|女装ぷれい|しりんだー浣腸器|真性包茎|すかとろじー|すとーりーぷれい|すぱんきんぐ|素股|すわっぴんぐ|精飲|精液|性具|性行為|性交体位|正常位|性的興奮|性的嗜好|性的倒錯|性的ろーるぷれい|せっくす|前戯|前立腺|早漏|側位|そふとSM|だっちわいふ|痴漢|痴女|膣外射精|膣内射精|膣分泌液|調教|遅漏|ちんぐり返し|でぃーぷ・すろーと|剃毛ぷれい|でぃるど|でぶ専|手まん|てれふぉんくらぶ|電ま|ところてん|どらいおーがずむ|奴隷|中出し|縄師|なんぱ|仁王立|ふぇら|肉便器|偽乳|にゅーはーふ|乳輪|妊娠線|のーずぷれい|のんけ|はーどSM|ぱいずり|ぱいぱん|はいひーる責め|ばいぶれーた|はめ撮り|ばら鞭|針責め|ぱんすと破り|BDSM|人妻|ぴる|ひるどいど|貧乳|ふぃすとふぁっく|風営法|ふぇち|ふぇらちお|不感症|腹射|二股|ぶっかけ|ぺってぃんぐ|ぺにすばんど|放置ぷれい|放尿|勃起|勃起不全|ぼんでーじ|まぞひずむ|まるき・ど・さど|まんぐり返し|まんこ|夢精|鞭打ち|胸射|名器|めいるれいぷ|目隠しぷれい|める友|綿ろーぷ|野外ぷれい|ゆるまん|幼児ぷれい|横恋慕|夜這い|４Ｐ|乱交|立位|陵辱|輪姦|蝋燭|ろーしょんぷれい|露出ぷれい|猥褻|和姦/

        if (simoneta.test(text)) {
            let arr = ["下ネタは禁止です。", "その言葉は不適切です。", "それはおそらく卑猥です。", "(; ･`д･´)"];
            var random = Math.floor(Math.random() * arr.length);
            var result = arr[random];
        } else if (suki.test(text)) {
            if (text.match(suki2)) {
                let arr = ["ありがとう", "え//", "えー", "lol", "www", "wwwwwwwwwww", "ん？ステーキ？", "いやぁ..."];
                var random = Math.floor(Math.random() * arr.length);
                var result = arr[random];
            } else if (select.test(text)) {
                let arr = ["どっちも好き！", "前者！", "後者！", "アンパンマン！"];
                var random = Math.floor(Math.random() * arr.length);
                var result = arr[random];
            } else if (sukinatabemono.test(text)) {
                let arr = ["寿司", "焼肉", "刺身 ", "ラーメン", "カレーライス", "鶏のから揚げ", "うどん", "そば", "パスタ", "野菜の煮物", "ぎょうざ", "天ぷら", "ステーキ", "サラダ", "焼魚", "ハンバーグ", "炊込みご飯", "鍋もの", "とんかつ", "焼き鳥", "すき焼", "魚の煮物", "みそ汁", "しゃぶしゃぶ", "お好み焼", "漬物", "納豆", "ピザ", "豆腐", "丼物", "グラタン", "チャーハン", "シチュー", "菓子パン", "酢の物", "ハンバーガー", "野菜いため", "たこ焼", "サンドイッチ", "おにぎり", "コロッケ", "焼そば", "ケーキ"];
                var random = Math.floor(Math.random() * arr.length);
                var result = `好きな食べ物は、${arr[random]}です！`
            } else if (sukinakyoku.test(text)) {
                let arr = ["ドライフラワー", "Subtitle", "新時代", "ミックスナッツ", "怪獣の花唄", "First Love", "KICK BACK", "サウダージ", "シンデレラボーイ", "マリーゴールド", "残酷な天使のテーゼ", "小さな恋のうた", "猫", "私は最強", "世界が終るまでは・・・", "残響散歌", "高嶺の花子さん", "丸の内サディスティック", "Pretender", "Lemon", "夜に駆ける", "W/X/Y", "さよならエレジー", "水平線", "ロマンスの神様", "チェリー", "キセキ", "天体観測", "糸", "Habit", "カブトムシ", "Love so sweet", "白日", "可愛くてごめん (feat.かぴ)", "うっせぇわ", "白い恋人達", "紅蓮華", "炎", "CITRUS", "HANABI", "粉雪", "新宝島", "大阪LOVER", "なんでもないよ,", "奏", "Butter-Fly", "さくらんぼ", "君はロックを聴かない", "ハナミズキ", "イケナイ太陽", "愛のかたまり", "ベテルギウス", "おジャ魔女カーニバル!!", "雪の華", "ダンスホール", "115万キロのフィルム", "ひまわりの約束", "366日", "そばかす", "花", "逆光", "Cry Baby", "TSUNAMI", "クリスマスソング", "愛をこめて花束を", "シンデレラガール", "ウタカタララバイ	", "踊", "青いベンチ", "Overdose", "祝福", "心絵	", "最後の雨", "硝子の少年", "青春アミーゴ", "3月9日", "裸の心", "タッチ", "君の知らない物語", "怪物", "魔法の絨毯", "ギラギラ", "ココロオドル", "I LOVE YOU", "初心LOVE(うぶらぶ)", "青と夏", "シャルル", "ウィーアー!", "シーソーゲーム~勇敢な恋の歌~", "島人ぬ宝(しまんちゅぬたから)", "アゲハ蝶", "踊り子", "ロビンソン", "君が好きだと叫びたい", "God Knows・・・", "栄光の架橋", "群青", "真夏の果実", "ツキヨミ"];
                var random = Math.floor(Math.random() * arr.length);
                var result = `好きな曲は、${arr[random]}です！`
            } else if (suki.test(text)) {
                let arr = ["嫌い", "好き", "ちょっと好き", "ちょっと嫌い", "ふつうかな", "なにそれ", "秘密", "はい", "はい！", "いいえ", "いいえ！", "えっ"];
                var random = Math.floor(Math.random() * arr.length);
                var result = arr[random];
            }
          } else if (ya.test(text)) {
              let arr = ["やぁ！", "ヤァ、元気かい？", "ゆう", "よう！", "こんにちは～"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (ohayo.test(text)) {
              let arr = ["おはよう！", "おはようございます！", "おっはよ～！", "おあよう！", "およ！", "オッス！", "おうよう"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (oyasumi.test(text)) {
              let arr = ["おやすみなさい", "いい夢見てね", "お疲れ様", "もう寝るの？", "ゆっくり休んでね", "早寝しようね！"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (kon.test(text) || text.match(kons)) {
              let arr = ["こんにちは！", "こん～", "やっほい！", "こんこん", "よう！"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (seibetu.test(text)) {
              let arr = ["秘密です!", "なんでしょうね～", "性別はたんたんです"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (morate.test(text)) {
              let arr = ["了解！", "なんだろう、嘘つくのやめてもらっていいですか？", "やだね～"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (english.test(text)) {
              let arr = ["Yes", "No", "I don't know", "Probably", "Probably not"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (sitteru.test(text)) {
              let arr = ["知らないですね", "知らない", "しらん", "何それ", "知ってる！", "知ってます！"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (desuka.test(text)) {
              let arr = ["そうですよ", "そうだよ", "そうだよ(便乗)", "違います", `なんすか、\n\`${text}\`\nって`];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else if (yaho.test(text)) {
              let arr = ["やほ！", "やほ～", "やっほい！", "やっほう", "よう！"];
              var random = Math.floor(Math.random() * arr.length);
              var result = arr[random];
          } else {
            let arr = ["はい", "はい!", "はい!!",
                "いいえ", "いいえ？", "もちろんさぁ",
                "たぶん",
                "絶対そう",
                "多分違う",
                "あいうえお",
                "・o・",
                "お答えできません。",
                `\`${text}\``,
                "もう一度言ってくれない？",
                "考えてみる", "うーん...",
                "もちろん違います",
                "完全に違うね",
                "私はそうは思わない",
                "ママに聞いてみるよ",
                "何を言ってるの？"
            ];
            var random = Math.floor(Math.random() * arr.length);
            var result = arr[random];
        }

        const Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`${i.user.username}「${text}」`)
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}`, url: '' })
            .setDescription(`たんたん「${result}」`)
            .setThumbnail(`${i.user.displayAvatarURL({dynamic: true})}`)
            .setTimestamp()
            .setFooter({ text: `/${cmdName}`, iconURL: '' });
       await i.reply({ embeds: [Embed] });
    }
}