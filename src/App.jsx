import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Clock, Trophy, Users, BarChart3, Calendar, Goal, X, Activity, Newspaper, Stethoscope, Award, ListChecks, ExternalLink, RefreshCw } from 'lucide-react';

/* ============================================================ 隊名 ============================================================ */
const CN_BY_ABBR={
  ARG:['阿根廷','ar'],BRA:['巴西','br'],FRA:['法國','fr'],ENG:['英格蘭','gb-eng'],ESP:['西班牙','es'],GER:['德國','de'],POR:['葡萄牙','pt'],NED:['荷蘭','nl'],ITA:['意大利','it'],BEL:['比利時','be'],
  CRO:['克羅地亞','hr'],URU:['烏拉圭','uy'],COL:['哥倫比亞','co'],MEX:['墨西哥','mx'],USA:['美國','us'],CAN:['加拿大','ca'],JPN:['日本','jp'],KOR:['韓國','kr'],AUS:['澳洲','au'],IRN:['伊朗','ir'],
  KSA:['沙特阿拉伯','sa'],QAT:['卡塔爾','qa'],MAR:['摩洛哥','ma'],SEN:['塞內加爾','sn'],GHA:['加納','gh'],CMR:['喀麥隆','cm'],NGA:['尼日利亞','ng'],EGY:['埃及','eg'],ALG:['阿爾及利亞','dz'],TUN:['突尼西亞','tn'],
  CIV:['科特迪瓦','ci'],SUI:['瑞士','ch'],SWE:['瑞典','se'],DEN:['丹麥','dk'],NOR:['挪威','no'],POL:['波蘭','pl'],SRB:['塞爾維亞','rs'],AUT:['奧地利','at'],SCO:['蘇格蘭','gb-sct'],WAL:['威爾士','gb-wls'],
  UKR:['烏克蘭','ua'],TUR:['土耳其','tr'],ECU:['厄瓜多爾','ec'],PER:['秘魯','pe'],CHI:['智利','cl'],PAR:['巴拉圭','py'],CRC:['哥斯達黎加','cr'],NZL:['新西蘭','nz'],PAN:['巴拿馬','pa'],JAM:['牙買加','jm'],
  HON:['洪都拉斯','hn'],RSA:['南非','za'],UZB:['烏茲別克','uz'],JOR:['約旦','jo'],IRQ:['伊拉克','iq'],UAE:['阿聯酋','ae'],CPV:['佛得角','cv'],SVN:['斯洛文尼亞','si'],SVK:['斯洛伐克','sk'],CZE:['捷克','cz'],
  HUN:['匈牙利','hu'],ROU:['羅馬尼亞','ro'],GRE:['希臘','gr'],RUS:['俄羅斯','ru'],VEN:['委內瑞拉','ve'],BOL:['玻利維亞','bo'],BIH:['波斯尼亞','ba'],CUW:['庫拉索','cw'],
};
const CN_BY_NAME={
  'czechia':['捷克','cz'],'czech republic':['捷克','cz'],'south africa':['南非','za'],'bosnia and herzegovina':['波斯尼亞','ba'],'bosnia-herzegovina':['波斯尼亞','ba'],'bosnia & herzegovina':['波斯尼亞','ba'],
  'iraq':['伊拉克','iq'],'uzbekistan':['烏茲別克','uz'],'cape verde':['佛得角','cv'],'cabo verde':['佛得角','cv'],'curaçao':['庫拉索','cw'],'curacao':['庫拉索','cw'],'ivory coast':['科特迪瓦','ci'],"côte d'ivoire":['科特迪瓦','ci'],
  'jordan':['約旦','jo'],'panama':['巴拿馬','pa'],'new zealand':['新西蘭','nz'],'saudi arabia':['沙特阿拉伯','sa'],'qatar':['卡塔爾','qa'],'south korea':['韓國','kr'],'korea republic':['韓國','kr'],'united states':['美國','us'],'iran':['伊朗','ir'],'ir iran':['伊朗','ir'],'netherlands':['荷蘭','nl'],'switzerland':['瑞士','ch'],
};
const SEED={
  MEX:{group:'A'},CRO:{group:'A'},ECU:{group:'A'},AUT:{group:'A'},CAN:{group:'B'},URU:{group:'B'},TUN:{group:'B'},TUR:{group:'B'},USA:{group:'C'},COL:{group:'C'},IRN:{group:'C'},UKR:{group:'C'},ARG:{group:'D'},JPN:{group:'D'},AUS:{group:'D'},SCO:{group:'D'},
  FRA:{group:'E'},KOR:{group:'E'},CRC:{group:'E'},WAL:{group:'E'},BRA:{group:'F'},SEN:{group:'F'},GHA:{group:'F'},NOR:{group:'F'},ENG:{group:'G'},MAR:{group:'G'},CMR:{group:'G'},SWE:{group:'G'},ESP:{group:'H'},SUI:{group:'H'},NGA:{group:'H'},PER:{group:'H'},
  POR:{group:'I'},DEN:{group:'I'},ALG:{group:'I'},CHI:{group:'I'},GER:{group:'J'},SRB:{group:'J'},EGY:{group:'J'},PAR:{group:'J'},NED:{group:'K'},POL:{group:'K'},KSA:{group:'K'},NZL:{group:'K'},BEL:{group:'L'},ITA:{group:'L'},QAT:{group:'L'},CIV:{group:'L'},
};
const groupOrder=['A','B','C','D','E','F','G','H','I','J','K','L'];
const groupTeams={}; Object.keys(SEED).forEach(c=>{const g=SEED[c].group;(groupTeams[g]=groupTeams[g]||[]).push(c);});
let teams={}; Object.keys(SEED).forEach(c=>{const m=CN_BY_ABBR[c]||[c,null];teams[c]={name:m[0],iso:m[1],group:SEED[c].group,logo:null,en:null,id:null};});
[['RSA','南非','za'],['BIH','波赫','ba'],['COD','民主剛果','cd'],['CPV','維德角','cv']].forEach(([c,n,iso])=>{if(!teams[c])teams[c]={name:n,iso,group:'—',logo:null,en:null,id:null};});
const groupOf=(code)=>(teams[code]&&teams[code].group)||'—';
const tname=(code)=>(teams[code]&&teams[code].name)||code;

/* ============================================================ 球員中文譯名字典（250+） ============================================================ */
const nameMap={
  美斯:'Messi',勞泰路:'Lautaro Martínez',迪馬利亞:'Di María',迪保羅:'De Paul',麥亞里斯達:'Mac Allister',馬天尼斯:'E. Martínez',阿爾巴雷斯:'Julián Álvarez',摩連奴:'Molina',奧達文迪:'Otamendi',羅美路:'Romero',派利迪斯:'Paredes',加力斯阿:'Garnacho',尼高干沙利斯:'Nico González',蒙鐵爾:'Montiel',阿庫尼亞:'Acuña',塔利亞菲高:'Tagliafico',
  維尼素斯:'Vinícius',洛迪高:'Rodrygo',拉菲尼亞:'Raphinha',卡斯米路:'Casemiro',馬基尼奧斯:'Marquinhos',阿利臣:'Alisson',尼馬:'Neymar',安東尼:'Antony',李察利森:'Richarlison',加保爾耶穌:'Gabriel Jesus',馬天尼利:'Martinelli',米列當奧:'Éder Militão',丹尼路:'Danilo',布魯諾:'Bruno Guimarães',柏基達:'Paquetá',蒂亞高施華:'Thiago Silva',艾達臣:'Ederson',雲達爾:'Wendell',
  安巴比:'Mbappé',基沙文:'Griezmann',杜尚美利:'Tchouaméni',卓奧美利:'Camavinga',干迪:'Koundé',麥尼安:'Maignan',簡迪:'Kanté',真奴:'Giroud',登貝萊:'Dembélé',高文:'Coman',拿比奧特:'Rabiot',華拉尼:'Varane',烏柏文奴域:'Upamecano',迪奧靴南迪斯:'Theo Hernández',哥奴迪:'Konaté',馬古斯杜林:'Marcus Thuram',巴高拿:'Barcola',哥羅穆亞尼:'Kolo Muani',
  簡尼:'Kane',貝靈漢:'Bellingham',科拿:'Foden',賴斯:'Rice',史東斯:'Stones',碧福特:'Pickford',辛達臣:'Henderson',沙卡:'Saka',史達寧:'Sterling',麥佳亞:'Maguire',獲加:'Walker',特里皮亞:'Trippier',鮑文:'Bowen',帕爾默:'Palmer',馬甸尼:'Mainoo',屈健斯:'Watkins',加拉查:'Gallagher',路克蕭:'Luke Shaw',哥莎:'Konsa',歌頓:'Gordon',
  奧爾莫:'Dani Olmo',摩拉達:'Morata',雅馬爾:'Yamal',佩特里:'Pedri',羅迪:'Rodri',尼高威廉斯:'Nico Williams',加維:'Gavi',法比安:'Fabián Ruiz',卡華積:'Carvajal',拿樸迪:'Laporte',古查迪:'Cucurella',施文:'Simón',艾歷加西亞:'Eric García',梅利奴:'Merino',費蘭托利斯:'Ferran Torres',祖些路:'Joselu',蘇拜文迪:'Zubimendi',
  慕西亞拉:'Musiala',維爾茨:'Wirtz',京明治:'Gündoğan',基米殊:'Kimmich',盧迪格:'Rüdiger',紐亞:'Neuer',夏維斯:'Havertz',山尼:'Sané',哥列斯卡:'Goretzka',富爾克魯格:'Füllkrug',安達歷治:'Andrich',泰亞:'Tah',米泰史達:'Mittelstädt',拉文:'Raum',
  'C朗拿度':'Ronaldo','B費南迪斯':'Bruno Fernandes',利奧:'Leão',路賓尼維斯:'Rúben Neves',貝拿度施華:'Bernardo Silva',迪科斯達:'Diogo Costa',迪奧高祖達:'Diogo Jota',簡些路:'Cancelo',迪亞士:'Rúben Dias',帕利尼亞:'Palhinha',域天奴:'Vitinha',費利斯:'João Félix',干沙路拉莫斯:'Gonçalo Ramos',達洛:'Dalot',佩比:'Pepe',里安奴山齊士:'Renato Sanches',
  迪龍:'De Jong',加保:'Gakpo',賴恩達斯:'Reijnders',迪歷治:'Dumfries',化荷斯:'Van Dijk',費爾邦:'Verbruggen',迪佩:'Depay',韋拿頓:'Wijnaldum',韋格斯:'Weghorst',沙維西蒙斯:'Xavi Simons',阿基:'Aké',迪利赫特:'De Ligt',馬倫:'Malen',布林特:'Blind',高普梅拿斯:'Koopmeiners',費林邦:'Frimpong',貝根荷斯:'Bergwijn',
  巴里拿:'Barella',基亞沙:'Chiesa',費拉迪斯:'Frattesi',托納利:'Tonali',巴斯托尼:'Bastoni',當拿隆馬:'Donnarumma',史卡馬卡:'Scamacca',列特古:'Retegui',簡比亞素:'Cambiaso',迪羅倫素:'Di Lorenzo',佐真奴:'Jorginho',韋拉堤:'Verratti',因莫比尼:'Immobile',迪馬高:'Dimarco',拉斯柏多里:'Raspadori',卡拉費奧里:'Calafiori',
  迪布尼:'De Bruyne',盧卡古:'Lukaku',杜古:'Doku',卡拉斯高:'Carrasco',添布文:'Tielemans',古圖斯:'Courtois',維素:'Witsel',卡斯天尼:'Castagne',文拿文連:'Vermeeren',巴卡約高:'Bakayoko',奧蓬達:'Openda',查迪奧利:'Trossard',雲丹簡:'Vanaken',
  莫迪歷:'Modrić',哥華錫:'Kovačić',布魯錫:'Brozović',佩里錫:'Perišić',簡馬歷錫:'Kramarić',葛伐迪奧:'Gvardiol',蘇沙:'Sosa',馬耶:'Majer',帕沙歷錫:'Pašalić',利雲奴域:'Livaković',佩特高維錫:'Petković',
  華拉迪:'Valverde',蘇亞雷斯:'Suárez',卡雲尼:'Cavani',賓坦古:'Bentancur',努尼斯:'Núñez',艾拿告:'Araujo',迪拿告斯:'De la Cruz',奧利華拿:'Olivera',干尼亞斯:'Cáceres',比尼亞:'Viña',
  三笘薰:'Mitoma',久保建英:'Kubo',遠藤航:'Endō',鎌田大地:'Kamada',富安健洋:'Tomiyasu',南野拓實:'Minamino',堂安律:'Dōan',伊東純也:'Itō',上田綺世:'Ueda',守田英正:'Morita',板倉滉:'Itakura',田中碧:'Ao Tanaka',淺野拓磨:'Asano',前田大然:'Maeda',旗手怜央:'Hatate',鈴木彩艷:'Zion Suzuki',
  孫興慜:'Son Heung-Min',李康仁:'Lee Kang-In',金玟哉:'Kim Min-Jae',黃喜燦:'Hwang Hee-Chan',黃仁範:'Hwang In-Beom',趙圭成:'Cho Gue-Sung',李在城:'Lee Jae-Sung',金珍洙:'Kim Jin-Su',金昇奎:'Kim Seung-Gyu',
  普利錫:'Pulisic',麥堅尼:'McKennie',阿當斯:'Adams',利拿:'Reyna',巴洛根:'Balogun',韋亞:'Weah',迪斯特:'Dest',李察士:'Richards',羅賓遜:'Robinson',特納:'Turner',
  羅薩奴:'Lozano',艾臣艾華拉:'Edson Álvarez',拿奧謙明尼斯:'Raúl Jiménez',維加:'Vega',安通拿:'Antuna',古鐵雷斯:'Gutiérrez',奧治祖亞:'Ochoa',
  哈基米:'Hakimi',施耶治:'Ziyech',安尼沙利:'En-Nesyri',阿姆拉巴:'Amrabat',邦奴:'Bounou',馬士奧:'Mazraoui',奧拿希:'Ounahi',沙比里:'Sabiri',
  哈蘭特:'Haaland',奧迪加:'Ødegaard',索保夫:'Sørloth',
  馬內:'Mané',古利巴利:'Koulibaly',伊斯文沙爾:'Ismaïla Sarr',加尼亞古爾:'Gueye',
  米杜洛維奇:'Mitrović',維拉鶴域:'Vlahović',米連歌域沙維奇:'Milinković-Savić',
  利雲度夫斯基:'Lewandowski',舒斯尼:'Szczęsny',施維斯達:'Zieliński',沙利夫斯基:'Zalewski',
  沙傑利:'Shaqiri',恩保路:'Embolo',查卡:'Xhaka',阿甘祖域:'Akanji',梳莫:'Sommer',佛尼拿:'Freuler',維格斯:'Vargas',
  艾歷臣:'Eriksen',賀祖:'Højlund',迪蘭尼:'Delaney',安達臣:'Andersen',舒米高:'Schmeichel',賀比格:'Højbjerg',
  阿拿保域:'Arnautović',沙比沙:'Sabitzer',包加頓:'Baumgartner',拿莫:'Laimer',阿拉巴:'Alaba',
  阿尤:'Ayew',古杜斯:'Kudus',柏迪:'Partey',
  詹姆斯洛迪古斯:'James Rodríguez',路爾迪亞士:'Luis Díaz',杜蘭:'Durán',古阿特拉度:'Cuadrado',波列:'Borré',米拿:'Mina',勒馬:'Lerma',
  奧斯文:'Osimhen',盧基文:'Lookman',朱古韋斯:'Chukwueze',伊禾比:'Iwobi',
  沙拿:'Salah',艾爾尼尼:'Elneny',查斯古特:'Trezeguet',
  華倫西亞:'Enner Valencia',軒卡比:'Hincapié',卡塞多:'Caicedo',柏拉達:'Plata',
  杜克:'Duke',艾雲:'Irvine',古特溫:'Goodwin',賴恩:'Ryan',
};
const enToCn={};
Object.entries(nameMap).forEach(([cn,en])=>{const k=en.toLowerCase();enToCn[k]=cn;const parts=en.split(/\s+/);const last=parts[parts.length-1].toLowerCase();if(!enToCn[last])enToCn[last]=cn;});
const CJK=/[\u3000-\u9fff\uf900-\ufaff]/;
function displayName(raw){if(!raw)return{cn:'',en:''};if(nameMap[raw])return{cn:raw,en:nameMap[raw]};const cn=enToCn[String(raw).toLowerCase()];if(cn)return{cn,en:raw};const last=String(raw).trim().split(/\s+/).pop().toLowerCase();if(enToCn[last])return{cn:enToCn[last],en:raw};return CJK.test(raw)?{cn:raw,en:''}:{cn:'',en:raw};}
function surname(full,short){if(short)return short;const p=String(full||'').trim().split(/\s+/);return p.length>1?p[p.length-1]:(full||'');}

/* 人手整理的球隊背景（ESPN 不提供，故只有部分） */
const teamDetails={
  ARG:{coach:'史卡隆尼',info:'衛冕世界盃冠軍，以美斯為核心，攻守均衡。',history:'3 次奪冠（1978、1986、2022）',news:['美斯狀態大勇','後防核心傷癒復出'],injuries:['迪保羅（大腿，待觀察）'],squad:['美斯','勞泰路','迪馬利亞','迪保羅','麥亞里斯達','馬天尼斯','阿爾巴雷斯','羅美路','奧達文迪','摩連奴','派利迪斯']},
  BRA:{coach:'安察洛堤',info:'五屆世界盃冠軍，新生代攻擊群火力十足。',history:'5 次奪冠（最近 2002）',news:['維尼素斯狀態回勇','新帥戰術見效'],injuries:['暫無重大傷病'],squad:['維尼素斯','洛迪高','拉菲尼亞','卡斯米路','馬基尼奧斯','阿利臣','李察利森','安東尼','布魯諾','柏基達','蒂亞高施華']},
  FRA:{coach:'迪甘斯',info:'近兩屆皆打入四強或以上，鋒線星光熠熠。',history:'2 次奪冠（1998、2018）',news:['安巴比狀態火熱','中場配置靈活'],injuries:['簡迪（腳踝，缺陣）'],squad:['安巴比','基沙文','杜尚美利','卓奧美利','干迪','麥尼安','真奴','登貝萊','拿比奧特','馬古斯杜林','華拉尼']},
  ENG:{coach:'圖高',info:'黃金一代逐漸成熟，期望突破樽頸。',history:'1 次奪冠（1966）',news:['簡尼持續入球','重用年輕翼鋒'],injuries:['辛達臣（膝蓋，缺陣）'],squad:['簡尼','貝靈漢','科拿','賴斯','史東斯','碧福特','沙卡','麥佳亞','獲加','帕爾默','路克蕭']},
  ESP:{coach:'迪拿費恩堤',info:'傳控結合新生代速度，整體實力強橫。',history:'1 次奪冠（2010）',news:['奧爾莫組織出色','後防穩固'],injuries:['暫無重大傷病'],squad:['奧爾莫','摩拉達','雅馬爾','佩特里','羅迪','尼高威廉斯','加維','卡華積','拿樸迪','古查迪','法比安']},
  GER:{coach:'拿高士文',info:'本土新生代崛起，主場士氣高昂。',history:'4 次奪冠（最近 2014）',news:['慕西亞拉成攻擊核心','中場控制力提升'],injuries:['紐亞（手指，待觀察）'],squad:['慕西亞拉','維爾茨','京明治','基米殊','盧迪格','紐亞','夏維斯','山尼','哥列斯卡','富爾克魯格','泰亞']},
  POR:{coach:'馬天尼斯',info:'經驗與青春並重，C朗拿度繼續領軍。',history:'最佳殿軍（1966、2006）',news:['C朗拿度持續入球','邊路犀利'],injuries:['暫無重大傷病'],squad:['C朗拿度','B費南迪斯','利奧','路賓尼維斯','貝拿度施華','迪科斯達','迪奧高祖達','簡些路','迪亞士','域天奴','費利斯']},
  NED:{coach:'高文',info:'攻守平衡的橙衣軍團。',history:'3 次亞軍（1974、1978、2010）',news:['迪龍入球效率高','防線老練'],injuries:['迪佩（膝蓋，缺陣）'],squad:['迪龍','加保','賴恩達斯','迪歷治','化荷斯','費爾邦','沙維西蒙斯','迪利赫特','阿基','馬倫','高普梅拿斯']},
  JPN:{coach:'森保一',info:'亞洲勁旅，旅歐球員眾多，速度與紀律兼備。',history:'多次打入十六強',news:['三笘薰狀態出色'],injuries:['暫無重大傷病'],squad:['三笘薰','久保建英','遠藤航','鎌田大地','富安健洋','南野拓實','堂安律','伊東純也','上田綺世','守田英正','板倉滉']},
  ITA:{coach:'史巴列堤',info:'防守傳統深厚，力爭爭標。',history:'4 次奪冠（最近 2006）',news:['整體防守紀律佳'],injuries:['暫無重大傷病'],squad:['巴里拿','基亞沙','費拉迪斯','托納利','巴斯托尼','當拿隆馬','史卡馬卡','列特古','迪羅倫素','佐真奴','卡拉費奧里']},
  BEL:{coach:'泰迪明',info:'黃金一代尾聲，仍具即戰力。',history:'最佳殿軍（2018）',news:['迪布尼領軍'],injuries:['暫無重大傷病'],squad:['迪布尼','盧卡古','杜古','卡拉斯高','添布文','古圖斯','奧蓬達','查迪奧利']},
  CRO:{coach:'達歷錫',info:'中場控制力強，老將經驗豐富。',history:'亞軍（2018）、季軍（2022）',news:['莫迪歷寶刀未老'],injuries:['暫無重大傷病'],squad:['莫迪歷','哥華錫','布魯錫','佩里錫','簡馬歷錫','葛伐迪奧','利雲奴域']},
};
const getDetails=(c)=> teamDetails[c]||{coach:'待公佈',info:null,history:null,news:null,injuries:null,squad:[]};
const realSquad=(code)=>(getDetails(code).squad||[]).filter(Boolean);

const players=[
  {name:'美斯',en:'Messi',code:'ARG',pos:'前鋒',num:10,age:38,club:'國際邁阿密',goals:4,assists:2,yellow:1,red:0},
  {name:'安巴比',en:'Mbappé',code:'FRA',pos:'前鋒',num:10,age:27,club:'皇家馬德里',goals:4,assists:1,yellow:0,red:0},
  {name:'維尼素斯',en:'Vinícius',code:'BRA',pos:'翼鋒',num:7,age:25,club:'皇家馬德里',goals:3,assists:2,yellow:1,red:0},
  {name:'簡尼',en:'Kane',code:'ENG',pos:'前鋒',num:9,age:32,club:'拜仁慕尼黑',goals:3,assists:1,yellow:1,red:0},
  {name:'C朗拿度',en:'Ronaldo',code:'POR',pos:'前鋒',num:7,age:41,club:'艾納斯',goals:3,assists:0,yellow:1,red:0},
  {name:'奧爾莫',en:'Dani Olmo',code:'ESP',pos:'中場',num:10,age:28,club:'巴塞隆拿',goals:2,assists:3,yellow:0,red:0},
  {name:'慕西亞拉',en:'Musiala',code:'GER',pos:'中場',num:14,age:23,club:'拜仁慕尼黑',goals:2,assists:2,yellow:0,red:0},
  {name:'盧卡古',en:'Lukaku',code:'BEL',pos:'前鋒',num:9,age:33,club:'拿玻里',goals:2,assists:1,yellow:0,red:0},
  {name:'三笘薰',en:'Mitoma',code:'JPN',pos:'翼鋒',num:11,age:29,club:'白禮頓',goals:2,assists:1,yellow:0,red:0},
  {name:'拉菲尼亞',en:'Raphinha',code:'BRA',pos:'翼鋒',num:11,age:29,club:'巴塞隆拿',goals:2,assists:1,yellow:1,red:0},
];
let REAL_SCORERS=[];
const getPlayer=(name)=>players.find(p=>p.name===name||(p.en&&p.en===name));
const googleUrl=(q)=>`https://www.google.com/search?q=${encodeURIComponent((q||'')+' 足球員')}&hl=zh-TW`;
const avatar=(seed)=>`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed||'p')}&radius=50&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,c1f4d4`;

const venues=['紐約／新澤西','洛杉磯','達拉斯','三藩市灣區','侯斯頓','坎薩斯城','費城','西雅圖','亞特蘭大','邁阿密','波士頓','多倫多','溫哥華','墨西哥城','瓜達拉哈拉','蒙特雷'];
const HK_TZ='Asia/Hong_Kong';
const hash=(s)=>{let h=0;s=String(s);for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;};
const NOW=new Date('2026-06-15T20:30:00Z').getTime();
const scoreFor=(c,salt)=> hash(c+salt)%4;
const pickScorer=(code,i)=>{const sq=realSquad(code);return sq.length? sq[hash(code+i)%sq.length] : tname(code)+' 球員';};
const ratingFor=(code,name,id)=> ((55+hash(code+name+id)%40)/10).toFixed(1);
function genEvents(home,away,hs,as,maxMin){const ev=[];for(let i=0;i<hs;i++){const m=Math.min(maxMin,10+i*25+hash(home+i)%15);ev.push({t:home,p:pickScorer(home,i),type:'goal',m,disp:String(m)});}for(let i=0;i<as;i++){const m=Math.min(maxMin,18+i*23+hash(away+i)%15);ev.push({t:away,p:pickScorer(away,i),type:'goal',m,disp:String(m)});}return ev.sort((a,b)=>a.m-b.m);}
function genStats(m){const H=(s)=>hash(m.home+m.id+s),A=(s)=>hash(m.away+m.id+s);const possH=40+H('p')%21;return {shots:[8+H('s')%12,8+A('s')%12],sot:[2+H('t')%6,2+A('t')%6],poss:[possH,100-possH],passes:[300+H('q')%300,300+A('q')%300],passAcc:[76+H('a')%17,76+A('a')%17],fouls:[6+H('f')%12,6+A('f')%12],yellow:[H('y')%4,A('y')%4],red:[H('r')%9===0?1:0,A('r')%11===0?1:0],offsides:[H('o')%5,A('o')%5],corners:[2+H('c')%8,2+A('c')%8]};}

const pairings=[[[0,1],[2,3]],[[0,2],[3,1]],[[3,0],[1,2]]];
let matches=[];let _id=0;
groupOrder.forEach((g,gi)=>{const t=groupTeams[g];pairings.forEach((md,mdi)=>{md.forEach((pair,slot)=>{const home=t[pair[0]],away=t[pair[1]];const baseDay=(mdi===0?11:mdi===1?17:23)+Math.floor(gi/2);const hour=(gi%2===0?[16,18]:[20,22])[slot];const dt=new Date(Date.UTC(2026,5,baseDay,hour,0,0));const start=dt.getTime(),end=start+7200000;let status,minute=null;if(end<=NOW)status='finished';else if(start<=NOW&&NOW<end){status='live';minute=Math.floor((NOW-start)/60000);}else status='upcoming';const m={id:++_id,espnId:null,round:'GROUP',group:g,home,away,datetime:dt.toISOString(),venue:venues[_id%venues.length],status,hs:null,as:null,minute,events:[],stats:null,lineups:null,_detail:false};if(status!=='upcoming'){m.hs=scoreFor(home,g+mdi+'h');m.as=scoreFor(away,g+mdi+'a');m.events=genEvents(home,away,m.hs,m.as,status==='live'?minute:90);m.stats=genStats(m);}matches.push(m);});});});

let STANDINGS={groups:null,codeGroup:null};
function groupKeys(){return STANDINGS.groups? Object.keys(STANDINGS.groups).sort(): groupOrder;}
function computeStandings(group){if(STANDINGS.groups&&STANDINGS.groups[group]){return [...STANDINGS.groups[group]].sort((a,b)=>(a.rank&&b.rank)?a.rank-b.rank:(b.Pts-a.Pts||b.GD-a.GD||b.GF-a.GF));}const codes=groupTeams[group]||[];const t={};codes.forEach(c=>t[c]={code:c,P:0,W:0,D:0,L:0,GF:0,GA:0,Pts:0});matches.filter(m=>m.group===group&&m.status==='finished'&&m.round==='GROUP').forEach(m=>{const h=t[m.home],a=t[m.away];if(!h||!a)return;h.P++;a.P++;h.GF+=m.hs;h.GA+=m.as;a.GF+=m.as;a.GA+=m.hs;if(m.hs>m.as){h.W++;a.L++;h.Pts+=3;}else if(m.hs<m.as){a.W++;h.L++;a.Pts+=3;}else{h.D++;a.D++;h.Pts++;a.Pts++;}});return Object.values(t).map(x=>({...x,GD:x.GF-x.GA})).sort((a,b)=>b.Pts-a.Pts||b.GD-a.GD||b.GF-a.GF);}

/* ============================================================ ESPN ============================================================ */
const ESPN_S='https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';
const ESPN_V2='https://site.api.espn.com/apis/v2/sports/soccer/fifa.world';
const WC_RANGE='20260611-20260719';
const ALIAS={SAU:'KSA',IRI:'IRN',NLD:'NED',SWI:'SUI'};
const numOf=(v)=>{const n=parseFloat(String(v==null?'':v).replace(/[^0-9.\-]/g,''));return isNaN(n)?0:n;};
function ingestTeam(t){if(!t)return null;let code=(t.abbreviation||'').toUpperCase();if(ALIAS[code])code=ALIAS[code];const nameKey=String(t.displayName||t.shortDisplayName||'').toLowerCase().trim();let meta=CN_BY_ABBR[code];if(!meta)meta=CN_BY_NAME[nameKey];if(!code)code=(nameKey.slice(0,3)||'???').toUpperCase();const ex=teams[code]||{};const seed=SEED[code];const cn=(meta&&meta[0])||ex.name;const iso=(meta&&meta[1])||ex.iso;teams[code]={name:cn||ex.name||t.shortDisplayName||t.displayName||code,iso:iso||null,group:ex.group||(seed&&seed.group),en:t.displayName||t.shortDisplayName||code,logo:ex.logo||t.logo||(t.logos&&t.logos[0]&&t.logos[0].href)||null,id:t.id||ex.id||null};return code;}
async function getJSON(url,ms=6500){const c=new AbortController();const to=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal});clearTimeout(to);if(!r.ok)throw new Error('http '+r.status);return await r.json();}catch(e){clearTimeout(to);throw e;}}
function parseClock(s){const str=String(s||'').replace(/['′\s]/g,'');const p=str.match(/(\d+)\+(\d+)/);if(p)return{min:+p[1]+(+p[2])/100,disp:`${p[1]}+${p[2]}`};const b=str.match(/(\d+)/);if(b)return{min:+b[1],disp:`${b[1]}`};return{min:0,disp:''};}
function pickAthlete(arr){if(!arr)return'';for(const a of arr){const x=(a&&a.athlete)||a;const n=x&&(x.displayName||x.shortName||x.fullName||x.lastName);if(n)return n;}return'';}
function parseCompDetails(comp,home,away,scorerMap){const side={};(comp.competitors||[]).forEach(c=>{if(c.team)side[c.team.id]=c.homeAway==='home'?home:away;});const evs=[];(comp.details||[]).forEach(d=>{const tp=((d.type&&d.type.text)||'').toLowerCase();let type=null;if(d.scoringPlay||/goal/.test(tp))type='goal';else if(/yellow/.test(tp))type='yellow';else if(/red/.test(tp))type='red';if(!type)return;const code=(d.team&&side[d.team.id])||home;const ath=d.athletesInvolved||[];const pl=pickAthlete(ath);const ck=parseClock((d.clock&&d.clock.displayValue)||'');evs.push({t:code,p:pl,type,m:ck.min,disp:ck.disp});if(type==='goal'&&pl&&scorerMap){const k=code+'|'+pl;(scorerMap[k]=scorerMap[k]||{name:pl,code,goals:0,assists:0}).goals++;const an=ath[1]&&((ath[1].athlete&&(ath[1].athlete.displayName||ath[1].athlete.shortName))||ath[1].displayName);if(an){const ak=code+'|'+an;(scorerMap[ak]=scorerMap[ak]||{name:an,code,goals:0,assists:0}).assists++;}}});return evs.sort((a,b)=>a.m-b.m);}

/* 輪次判斷：優先用 ESPN 提供的輪次名稱，否則以日期作後備 */
function dateRound(iso){const d=new Date(iso);const day=Date.UTC(2026,d.getUTCMonth(),d.getUTCDate());const D=(mo,dd)=>Date.UTC(2026,mo-1,dd);if(day<=D(6,27))return'GROUP';if(day<=D(7,3))return'R32';if(day<=D(7,8))return'R16';if(day<=D(7,12))return'QF';if(day<=D(7,16))return'SF';if(day<=D(7,18))return'3RD';return'F';}
function parseRound(comp,ev){let txt='';if(comp&&comp.notes&&comp.notes.length)txt+=comp.notes.map(n=>(n.headline||n.text||'')).join(' ');if(comp&&comp.type&&comp.type.text)txt+=' '+comp.type.text;if(ev&&ev.season&&ev.season.slug)txt+=' '+ev.season.slug;txt=txt.toLowerCase();if(!txt.trim())return null;if(/group/.test(txt))return'GROUP';if(/round of 32|1\/16|last 32/.test(txt))return'R32';if(/round of 16|1\/8|last 16/.test(txt))return'R16';if(/quarter/.test(txt))return'QF';if(/(3rd|third)\s*place/.test(txt))return'3RD';if(/semi/.test(txt))return'SF';if(/final/.test(txt))return'F';return null;}
function koRound(m){if(m&&m.round)return m.round;return dateRound(m.datetime);}

async function fetchAllMatches(){try{const j=await getJSON(`${ESPN_S}/scoreboard?dates=${WC_RANGE}&limit=400`);const out=[];let id=0;const scorerMap={};for(const ev of (j.events||[])){const comp=ev.competitions&&ev.competitions[0];if(!comp)continue;const cs=comp.competitors||[];const hC=cs.find(c=>c.homeAway==='home')||cs[0],aC=cs.find(c=>c.homeAway==='away')||cs[1];const home=ingestTeam(hC&&hC.team),away=ingestTeam(aC&&aC.team);if(!home||!away||home===away)continue;const st=ev.status&&ev.status.type&&ev.status.type.state;const status=st==='post'?'finished':st==='in'?'live':'upcoming';const minute=status==='live'?(parseClock(ev.status&&ev.status.displayClock).min|0||1):null;const round=parseRound(comp,ev)||dateRound(ev.date);const m={id:++id,espnId:ev.id,round,group:(teams[home]&&teams[home].group)||'—',home,away,datetime:ev.date,venue:(comp.venue&&comp.venue.fullName)||venues[id%venues.length],status,hs:null,as:null,minute,events:[],stats:null,lineups:null,_detail:false};if(status!=='upcoming'){m.hs=parseInt(hC.score)||0;m.as=parseInt(aC.score)||0;const det=parseCompDetails(comp,home,away,scorerMap);m.events=det.length?det:genEvents(home,away,m.hs,m.as,status==='live'?(minute||45):90);m.stats=genStats(m);}out.push(m);}const scorers=Object.values(scorerMap).filter(s=>s.goals>0).sort((a,b)=>b.goals-a.goals||b.assists-a.assists).slice(0,40);return{ok:true,matches:out,scorers};}catch(e){return{ok:false,matches:[],scorers:[]};}}
async function fetchStandings(){try{const j=await getJSON(`${ESPN_V2}/standings`);const children=j.children||(j.standings?[{name:'',standings:j.standings}]:[]);const groups={},codeGroup={};for(const ch of children){const gname=String(ch.name||ch.abbreviation||'').replace(/group/i,'').trim()||'—';const entries=(ch.standings&&ch.standings.entries)||[];const rows=entries.map(en=>{const code=ingestTeam(en.team);if(!code)return null;const st={};(en.stats||[]).forEach(s=>{st[s.name]=(s.value!=null?s.value:numOf(s.displayValue));});const pick=(...n)=>{for(const k of n)if(st[k]!=null)return st[k];return 0;};const GF=pick('pointsFor','goalsFor'),GA=pick('pointsAgainst','goalsAgainst');return{code,P:pick('gamesPlayed'),W:pick('wins'),D:pick('ties','draws'),L:pick('losses'),GF,GA,GD:pick('pointDifferential','goalDifferential')||(GF-GA),Pts:pick('points'),rank:pick('rank')};}).filter(Boolean);if(rows.length){groups[gname]=rows;rows.forEach(r=>{codeGroup[r.code]=gname;if(teams[r.code])teams[r.code].group=gname;});}}if(Object.keys(groups).length)return{ok:true,groups,codeGroup};return{ok:false};}catch(e){return{ok:false};}}
async function fetchTeamRoster(code){const t=teams[code];if(!t||!t.id)return null;try{const j=await getJSON(`${ESPN_S}/teams/${t.id}/roster`);let raw=j.athletes||[];let list=[];if(raw.length&&raw[0]&&raw[0].items)raw.forEach(g=>g.items.forEach(p=>list.push(p)));else list=raw;return list.map(p=>{const a=p.athlete||p;return{name:a.displayName||a.fullName||a.shortName||'',short:a.shortName||'',num:a.jersey||p.jersey||'',pos:(a.position&&(a.position.abbreviation||a.position.name))||''};}).filter(p=>p.name);}catch(e){return null;}}

/* 陣式 */
function formationCoords(formation){const parts=String(formation||'4-3-3').split('-').map(n=>parseInt(n)).filter(n=>n>0);if(!parts.length||parts.reduce((a,b)=>a+b,0)!==10)parts.splice(0,parts.length,4,3,3);const coords=[{x:50,y:8}];const n=parts.length;parts.forEach((count,ri)=>{const y=18+(n>1?ri*(46-18)/(n-1):14);for(let i=0;i<count;i++){const x=count===1?50:14+i*(72/(count-1));coords.push({x,y});}});return coords;}
function lineupLabel(full,short){const dn=displayName(full);if(dn.cn)return dn.cn;const ds=displayName(short);if(ds.cn)return ds.cn;return surname(full,short);}
function buildPositioned(plist,formation){let ps=plist.slice(0,11);if(ps.length&&ps.every(p=>p.place))ps=[...ps].sort((a,b)=>a.place-b.place);const co=formationCoords(formation);return ps.map((p,i)=>{const c=co[i]||{x:50,y:30};return{label:lineupLabel(p.name,p.short),en:p.name,num:p.num||'',x:c.x,y:c.y};});}
const NUMS=[1,2,4,5,3,6,8,14,7,9,11];
const genericPool=[['加西亞','García'],['施華','Silva'],['桑托斯','Santos'],['梅拿','Müller'],['泰萊','Taylor'],['迪亞士','Dias'],['彼得遜','Petersen'],['杜邦','Dupont'],['哈山','Hassan'],['卡奧斯','Karlsson'],['伊雲奴域','Ivanović'],['真高','Janko'],['奧雲','Owen'],['摩拉','Mora'],['列治','Reich'],['科瓦','Kovač'],['阿里','Ali'],['田中','Tanaka'],['金','Kim'],['羅斯','Ross']];
const FAKE_FORMATIONS=['4-3-3','4-2-3-1','4-4-2','3-4-3','3-5-2','4-3-2-1'];
const TEAM_FORM={ARG:'4-4-2',BRA:'4-2-3-1',FRA:'4-3-3',ENG:'4-2-3-1',ESP:'4-3-3',GER:'4-2-3-1',POR:'4-3-3',NED:'4-3-3',ITA:'3-5-2',BEL:'3-4-2-1',CRO:'4-3-3',URU:'4-4-2',JPN:'3-4-2-1',KOR:'4-2-3-1',USA:'4-3-3',MEX:'4-3-3',MAR:'4-3-3',SEN:'4-3-3',GHA:'4-2-3-1',ECU:'4-4-2',NGA:'3-4-3',EGY:'4-2-3-1',COL:'4-2-3-1',AUS:'4-2-3-1',DEN:'3-4-3',SUI:'4-2-3-1',SRB:'3-4-2-1',POL:'4-2-3-1',AUT:'4-2-3-1',NOR:'4-3-3'};
const teamFormation=(code)=> TEAM_FORM[code]||FAKE_FORMATIONS[hash(code)%FAKE_FORMATIONS.length];
function buildLineupFake(code){const formation=teamFormation(code);const coords=formationCoords(formation);const arr=coords.slice(0,11).map((c,i)=>({x:c.x,y:c.y,num:'',label:'',en:''}));const stars=realSquad(code);for(let k=0;k<stars.length&&k<arr.length-1;k++){const slot=arr.length-1-k;const n=stars[k];arr[slot].label=displayName(n).cn||n;arr[slot].en=nameMap[n]||'';}let gi=hash(code)%genericPool.length;arr.forEach((p,i)=>{if(p.num==='')p.num=NUMS[i]||i+1;if(!p.label){const g=genericPool[(gi++)%genericPool.length];p.label=g[0];p.en=g[1];}});return {arr,formation};}

function parseSummary(j,home,away){const res={};try{const comp=j.header&&j.header.competitions&&j.header.competitions[0];const side={};if(comp&&comp.competitors)comp.competitors.forEach(c=>{side[c.team.id]=c.homeAway==='home'?'h':'a';});const evs=[];(j.keyEvents||[]).forEach(e=>{const txt=((e.type&&e.type.text)||'').toLowerCase();let type=null;if(txt.includes('goal'))type='goal';else if(txt.includes('yellow'))type='yellow';else if(txt.includes('red'))type='red';if(!type)return;const s=e.team?side[e.team.id]:null;const code=s==='h'?home:s==='a'?away:home;const pl=pickAthlete(e.athletesInvolved)||pickAthlete(e.participants);const ck=parseClock((e.clock&&e.clock.displayValue)||'');evs.push({t:code,p:pl,type,m:ck.min,disp:ck.disp});});if(evs.length)res.events=evs.sort((a,b)=>a.m-b.m);const bs=j.boxscore&&j.boxscore.teams;if(bs&&bs.length>=2){const Ht=bs.find(t=>side[t.team.id]==='h')||bs[0],At=bs.find(t=>side[t.team.id]==='a')||bs[1];const get=(team,names)=>{const stat=team.statistics||[];for(const n of names){const f=stat.find(s=>s.name===n);if(f)return numOf(f.displayValue);}return null;};const pH=get(Ht,['possessionPct']);if(pH!=null){const pA=get(At,['possessionPct']);const h=Math.round(pH),a=pA!=null?Math.round(pA):100-h;res.stats={shots:[get(Ht,['totalShots'])||0,get(At,['totalShots'])||0],sot:[get(Ht,['shotsOnTarget'])||0,get(At,['shotsOnTarget'])||0],poss:[h,a],passes:[get(Ht,['totalPasses','passesTotal'])||0,get(At,['totalPasses','passesTotal'])||0],passAcc:[get(Ht,['passPct','accuratePasses'])||0,get(At,['passPct','accuratePasses'])||0],fouls:[get(Ht,['foulsCommitted'])||0,get(At,['foulsCommitted'])||0],yellow:[get(Ht,['yellowCards'])||0,get(At,['yellowCards'])||0],red:[get(Ht,['redCards'])||0,get(At,['redCards'])||0],offsides:[get(Ht,['offsides'])||0,get(At,['offsides'])||0],corners:[get(Ht,['wonCorners'])||0,get(At,['wonCorners'])||0]};}}const rosters=j.rosters||[];if(rosters.length){const lu={};rosters.forEach(r=>{const s=r.homeAway;const form=r.formation&&(r.formation.name||r.formation.displayName||r.formation.text);const starters=(r.roster||[]).filter(p=>p.starter);const plist=starters.map(p=>{const a=p.athlete||{};return{name:a.displayName||a.fullName||a.shortName||'',short:a.shortName||'',num:p.jersey||a.jersey||'',place:parseInt(p.formationPlace)||null};});if(plist.length)lu[s==='home'?'home':'away']={players:buildPositioned(plist,form),formation:form||'—'};});if(lu.home&&lu.away)res.lineups=lu;}}catch(e){}return res;}
async function fetchMatchDetail(espnId,home,away){try{const j=await getJSON(`${ESPN_S}/summary?event=${espnId}`);return parseSummary(j,home,away);}catch(e){return null;}}

/* ============================================================ UI ============================================================ */
const fmtDate=(iso)=>{try{return new Intl.DateTimeFormat('zh-HK',{timeZone:HK_TZ,month:'long',day:'numeric',weekday:'short'}).format(new Date(iso));}catch(e){return iso;}};
const fmtTime=(iso)=>{try{return new Intl.DateTimeFormat('zh-HK',{timeZone:HK_TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso));}catch(e){return'';}};
const localDay=(m)=> new Intl.DateTimeFormat('en-CA',{timeZone:HK_TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(m.datetime));
const dayLabel=(k)=>{const[,mo,d]=k.split('-');return `${+mo}月${+d}日`;};
const todayKey=()=> new Intl.DateTimeFormat('en-CA',{timeZone:HK_TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());

const Flag=({code,cls="w-7 h-5"})=>{const t=teams[code];if(!t)return <span className={`${cls} inline-block`}/>;const src=t.iso?`https://flagcdn.com/w80/${t.iso}.png`:t.logo;if(!src)return <span className={`${cls} inline-block bg-slate-200 rounded`}/>;return <img src={src} alt={t.name} className={`${cls} object-contain rounded shadow-sm inline-block align-middle ring-1 ring-black/5`} loading="lazy"/>;};
function NameTag({raw,main='text-slate-800',sub='text-slate-400'}){const{cn,en}=displayName(raw);if(cn)return <span className="leading-tight"><span className={`font-medium ${main}`}>{cn}</span>{en&&<span className={`text-[11px] ${sub} ml-1`}>{en}</span>}</span>;return <span className={`font-medium ${main}`}>{en||raw}</span>;}
const Badge=({status,minute})=>{if(status==='live')return <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>{minute}'</span>;if(status==='finished')return <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">完場</span>;return <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">未開始</span>;};

function MatchCard({m,onMatch,onTeam}){const g=groupOf(m.home);return (
  <div className={`bg-white rounded-2xl border ${m.status==='live'?'border-rose-200 ring-1 ring-rose-100':'border-slate-200/70'} hover:shadow-lg hover:-translate-y-0.5 transition-all p-3.5`}>
    <div className="flex items-center justify-between mb-2.5"><span className="text-[11px] text-slate-400 font-medium truncate">{g!=='—'?`${g} 組 · `:''}{m.venue}</span><Badge status={m.status} minute={m.minute}/></div>
    <div className="flex items-center justify-between gap-1">
      <button onClick={()=>onTeam(m.home)} className="flex-1 flex items-center gap-2 min-w-0 hover:bg-slate-50 rounded-lg p-1.5 -m-1.5 transition"><Flag code={m.home}/><span className="font-semibold text-slate-800 truncate text-sm">{tname(m.home)}</span></button>
      <button onClick={()=>onMatch(m)} className="px-3 text-center hover:bg-emerald-50 rounded-lg py-1 transition shrink-0">{m.status==='upcoming'?<div className="text-base font-bold text-slate-700">{fmtTime(m.datetime)}</div>:<div className="text-xl font-extrabold text-slate-900 tabular-nums">{m.hs}<span className="text-slate-300 mx-1">-</span>{m.as}</div>}<div className="text-[10px] text-slate-400 mt-0.5">{fmtDate(m.datetime)}</div></button>
      <button onClick={()=>onTeam(m.away)} className="flex-1 flex items-center gap-2 justify-end min-w-0 hover:bg-slate-50 rounded-lg p-1.5 -m-1.5 transition"><span className="font-semibold text-slate-800 truncate text-right text-sm">{tname(m.away)}</span><Flag code={m.away}/></button>
    </div>
  </div>);}

function Countdown({target}){const[now,setNow]=useState(Date.now());useEffect(()=>{const i=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(i);},[]);if(!target)return null;let diff=Math.max(0,new Date(target).getTime()-now);const d=Math.floor(diff/86400000);diff-=d*86400000;const h=Math.floor(diff/3600000);diff-=h*3600000;const mn=Math.floor(diff/60000);diff-=mn*60000;const s=Math.floor(diff/1000);const Box=({v,l})=>(<div className="flex flex-col items-center bg-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm ring-1 ring-white/20"><span className="text-2xl font-extrabold tabular-nums">{String(v).padStart(2,'0')}</span><span className="text-[10px] opacity-80 mt-0.5">{l}</span></div>);return <div className="flex gap-2"><Box v={d} l="日"/><Box v={h} l="時"/><Box v={mn} l="分"/><Box v={s} l="秒"/></div>;}

function Modal({children,onClose}){return (<div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-3 overflow-y-auto" onClick={onClose}><div className="relative bg-slate-50 rounded-3xl w-full max-w-2xl my-6 shadow-2xl ring-1 ring-black/5" onClick={e=>e.stopPropagation()}><button onClick={onClose} className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm transition"><X className="w-5 h-5 text-slate-600"/></button><div className="px-5 pt-6 pb-7">{children}</div></div></div>);}

const ratingCls=(r)=> r>=7.5?'bg-emerald-500':r>=6.5?'bg-lime-500':r>=6?'bg-amber-400':'bg-rose-400';
function PlayerDot({p,code,matchId,showRating,onPlayer,colorRing}){const label=p.label||p.en;const seed=p.en||label;const r=ratingFor(code,seed,matchId);return (<button onClick={()=>{const pl=getPlayer(label)||getPlayer(p.en);pl?onPlayer(pl):window.open(googleUrl(p.en||label),'_blank');}} className="absolute flex flex-col items-center" style={{left:`${p.x}%`,top:`${p.y}%`,transform:'translate(-50%,-50%)'}}><div className="relative"><img src={avatar(seed+code)} alt={label} className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white shadow-md ring-2 ${colorRing}`} loading="lazy"/>{p.num!==''&&<span className="absolute -bottom-1 -right-1 text-[8px] bg-slate-900 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">{p.num}</span>}{showRating&&<span className={`absolute -top-1.5 -left-1.5 text-[7px] text-white font-bold rounded px-0.5 ${ratingCls(+r)}`}>{r}</span>}</div><span className="mt-0.5 inline-block max-w-[50px] sm:max-w-[66px] truncate whitespace-nowrap text-[8px] sm:text-[9px] text-white font-semibold bg-black/55 px-1 rounded leading-none py-0.5 text-center">{label}</span></button>);}
function FormationPitch({m,showRating,onPlayer}){const real=!!m.lineups;const hb=real?m.lineups.home:buildLineupFake(m.home);const ab=real?m.lineups.away:buildLineupFake(m.away);const home=real?hb.players:hb.arr;const away=real?ab.players:ab.arr;const hf=real?hb.formation:hb.formation;const af=real?ab.formation:ab.formation;return (<div><div className="flex items-center justify-between mb-2 text-xs"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-300"></span><b>{tname(m.home)}</b> <span className="text-slate-400">{hf}</span></span><span className="flex items-center gap-1.5"><span className="text-slate-400">{af}</span> <b>{tname(m.away)}</b><span className="w-2.5 h-2.5 rounded-full bg-sky-300 ring-2 ring-sky-300"></span></span></div><div className="relative w-full rounded-2xl overflow-hidden shadow-inner" style={{paddingBottom:'138%',background:'repeating-linear-gradient(0deg,#15803d 0,#15803d 8.33%,#16a34a 8.33%,#16a34a 16.66%)'}}><div className="absolute inset-0"><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/40"></div><div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/40"></div><div className="absolute left-1/2 -translate-x-1/2 top-0 w-2/5 h-[12%] border-2 border-t-0 border-white/40"></div><div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/5 h-[12%] border-2 border-b-0 border-white/40"></div><div className="absolute inset-1.5 border-2 border-white/30 rounded-lg"></div></div>{home.map((p,i)=><PlayerDot key={'h'+i} p={p} code={m.home} matchId={m.id} showRating={showRating} onPlayer={onPlayer} colorRing="ring-emerald-300"/>)}{away.map((p,i)=><PlayerDot key={'a'+i} p={{...p,x:100-p.x,y:100-p.y}} code={m.away} matchId={m.id} showRating={showRating} onPlayer={onPlayer} colorRing="ring-sky-300"/>)}</div><p className="text-[10px] text-slate-400 mt-1.5 text-center">{real?'真實首發與陣式（ESPN）· 已收錄球星顯示中文，其餘為英文姓氏':'示意陣容（採各隊慣用陣式，待 ESPN 提供首發）'}</p></div>);}

function StatRow({label,h,a,fmt}){const f=fmt||((x)=>x);const total=h+a||1;const Pill=({v,on,side})=>(<span className={`min-w-[44px] text-center text-sm font-bold px-2 py-0.5 rounded-lg ${on?(side==='h'?'bg-emerald-500 text-white':'bg-sky-500 text-white'):'text-slate-700'}`}>{f(v)}</span>);return (<div className="py-1.5 border-b border-slate-100 last:border-0"><div className="flex items-center justify-between text-sm"><Pill v={h} on={h>a} side="h"/><span className="text-slate-500 text-xs font-medium">{label}</span><Pill v={a} on={a>h} side="a"/></div><div className="flex gap-1 mt-1.5 h-1"><div className="bg-emerald-400 rounded-full" style={{width:`${h/total*100}%`}}/><div className="bg-sky-400 rounded-full ml-auto" style={{width:`${a/total*100}%`}}/></div></div>);}

function StandingsTable({rows,highlight=[],onTeam,accent}){const C="w-9 text-center text-slate-500 tabular-nums";return (<table className="w-full text-sm"><thead><tr className="text-[11px] text-slate-400"><th className="text-left pl-3 pr-1 py-2 font-medium">球隊</th><th className="w-9 font-medium">賽</th><th className="w-9 font-medium">勝</th><th className="w-9 font-medium">和</th><th className="w-9 font-medium">負</th><th className="w-12 font-medium">得失</th><th className="w-10 pr-3 font-medium">分</th></tr></thead><tbody>{rows.map((r,i)=>{const on=highlight.includes(r.code);return (<tr key={r.code} className={`border-t border-t-slate-100 ${on?'bg-emerald-50':''} ${accent(i,r.code)}`}><td className="pl-3 pr-1 py-2"><button onClick={()=>onTeam(r.code)} className="flex items-center gap-1.5 hover:text-emerald-600 min-w-0 w-full"><span className="text-xs text-slate-400 w-3 shrink-0">{i+1}</span><Flag code={r.code} cls="w-5 h-3.5 shrink-0"/><span className={`truncate ${on?'font-bold':'font-medium'}`}>{tname(r.code)}</span></button></td><td className={C}>{r.P}</td><td className={C}>{r.W}</td><td className={C}>{r.D}</td><td className={C}>{r.L}</td><td className="w-12 text-center text-xs text-slate-500 tabular-nums">{r.GD>0?`+${r.GD}`:r.GD}</td><td className="w-10 text-center font-bold pr-3 tabular-nums">{r.Pts}</td></tr>);})}</tbody></table>);}
const accDirect=(i)=> i<2?'border-l-4 border-l-emerald-400':i===2?'border-l-4 border-l-amber-400':'border-l-4 border-l-rose-300';
function MiniStandings({group,highlight,onTeam}){const rows=computeStandings(group);return (<div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden mb-3"><div className="bg-slate-50 px-3 py-2 text-sm font-bold border-b border-slate-100 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-emerald-600"/>{group} 組積分榜</div><StandingsTable rows={rows} highlight={highlight} onTeam={onTeam} accent={(i)=>accDirect(i)}/></div>);}

function MatchDetail({m,onTeam,onPlayer}){const s=m.stats;const g=groupOf(m.home);const icon=(t)=>t==='goal'?'⚽':t==='yellow'?'🟨':t==='red'?'🟥':'•';const loading=m.espnId&&!m._detail&&m.status!=='upcoming';return (<div><div className="text-center text-xs text-slate-400 mb-3 px-6">{g!=='—'?`${g} 組 · `:''}{m.venue}<br/>{fmtDate(m.datetime)} {fmtTime(m.datetime)}（香港時間）</div>{loading&&<div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 mb-3"><RefreshCw className="w-3.5 h-3.5 animate-spin"/>正在載入即時陣容與賽事數據…</div>}<div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 mb-4 text-white"><div className="flex items-center justify-center gap-4"><button onClick={()=>onTeam(m.home)} className="flex flex-col items-center gap-1.5 hover:opacity-80 flex-1"><Flag code={m.home} cls="w-14 h-9"/><span className="text-sm font-bold text-center">{tname(m.home)}</span></button><div className="text-center px-2 shrink-0"><div className="text-4xl font-extrabold tabular-nums">{m.status==='upcoming'?'VS':`${m.hs} - ${m.as}`}</div><div className="mt-1"><Badge status={m.status} minute={m.minute}/></div></div><button onClick={()=>onTeam(m.away)} className="flex flex-col items-center gap-1.5 hover:opacity-80 flex-1"><Flag code={m.away} cls="w-14 h-9"/><span className="text-sm font-bold text-center">{tname(m.away)}</span></button></div></div>{m.status!=='upcoming'&&(<div className="bg-white rounded-2xl border border-slate-200/70 p-3.5 mb-3"><h4 className="text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-600"/>出場陣容</h4><FormationPitch m={m} showRating={true} onPlayer={onPlayer}/></div>)}{m.events&&m.events.length>0&&(<div className="bg-white rounded-2xl border border-slate-200/70 p-3.5 mb-3"><h4 className="text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-600"/>賽事時序</h4><ul className="space-y-2">{m.events.map((e,i)=>(<li key={i} className="flex items-center gap-2 text-sm"><span className="text-xs text-slate-400 w-12 tabular-nums">{e.disp||e.m}'</span><span>{icon(e.type)}</span><Flag code={e.t} cls="w-5 h-3.5"/>{e.p?<button onClick={()=>{const pl=getPlayer(e.p);pl?onPlayer(pl):window.open(googleUrl(displayName(e.p).en||e.p),'_blank');}} className="hover:underline text-left"><NameTag raw={e.p} main="text-slate-700"/></button>:<span className="text-slate-400 text-xs">{tname(e.t)}</span>}</li>))}</ul></div>)}{s&&(<div className="bg-white rounded-2xl border border-slate-200/70 p-3.5 mb-3"><div className="flex items-center justify-between mb-2"><Flag code={m.home} cls="w-6 h-4"/><h4 className="text-sm font-bold text-slate-700">球隊數據</h4><Flag code={m.away} cls="w-6 h-4"/></div><StatRow label="射門" h={s.shots[0]} a={s.shots[1]}/><StatRow label="射正" h={s.sot[0]} a={s.sot[1]}/><StatRow label="控球率" h={s.poss[0]} a={s.poss[1]} fmt={(x)=>x+'%'}/><StatRow label="傳球" h={s.passes[0]} a={s.passes[1]}/><StatRow label="傳球成功率" h={s.passAcc[0]} a={s.passAcc[1]} fmt={(x)=>x+'%'}/><StatRow label="角球" h={s.corners[0]} a={s.corners[1]}/><StatRow label="越位" h={s.offsides[0]} a={s.offsides[1]}/><StatRow label="犯規" h={s.fouls[0]} a={s.fouls[1]}/><StatRow label="黃牌" h={s.yellow[0]} a={s.yellow[1]}/><StatRow label="紅牌" h={s.red[0]} a={s.red[1]}/></div>)}{g!=='—'&&m.round==='GROUP'&&<MiniStandings group={g} highlight={[m.home,m.away]} onTeam={onTeam}/>}{m.status==='upcoming'&&(<div className="grid grid-cols-2 gap-3">{[m.home,m.away].map(code=>(<div key={code} className="bg-white rounded-2xl border border-slate-200/70 p-3.5"><div className="flex items-center gap-2 mb-2.5"><Flag code={code} cls="w-6 h-4"/><span className="font-bold text-sm">{tname(code)}</span></div><ul className="space-y-1.5">{realSquad(code).length?realSquad(code).map((p,i)=>(<li key={i} className="flex items-center gap-2"><img src={avatar(p+code)} className="w-6 h-6 rounded-full bg-slate-100" loading="lazy"/><button onClick={()=>{const pl=getPlayer(p);pl?onPlayer(pl):window.open(googleUrl(p),'_blank');}} className="text-xs hover:underline"><NameTag raw={p} main="text-slate-700"/></button></li>)):<li className="text-xs text-slate-400">名單將於開賽前公佈</li>}</ul></div>))}</div>)}</div>);}

function PlayerPage({p}){const Info=({k,v})=>(<div className="flex justify-between py-2 border-b border-slate-100 text-sm last:border-0"><span className="text-slate-400">{k}</span><span className="font-semibold text-slate-700">{v}</span></div>);return (<div><div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 mb-4 text-white flex items-center gap-4"><img src={avatar(p.name+p.code)} alt={p.name} className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/50 shrink-0"/><div><h3 className="text-2xl font-extrabold leading-tight">{p.name}</h3>{p.en&&<div className="text-sm opacity-90">{p.en}</div>}<div className="flex items-center gap-1.5 text-sm opacity-90 mt-0.5"><Flag code={p.code} cls="w-5 h-3.5"/>{tname(p.code)} · #{p.num}</div></div></div><div className="bg-white rounded-2xl border border-slate-200/70 p-4 mb-3"><h4 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-600"/>個人資料</h4><Info k="位置" v={p.pos}/><Info k="球衣號碼" v={'#'+p.num}/><Info k="年齡" v={p.age+' 歲'}/><Info k="所屬球會" v={p.club}/></div><div className="bg-white rounded-2xl border border-slate-200/70 p-4 mb-3"><h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-emerald-600"/>本屆數據</h4><div className="grid grid-cols-4 gap-2 text-center">{[['入球',p.goals,'text-emerald-600'],['助攻',p.assists,'text-sky-600'],['黃牌',p.yellow,'text-amber-500'],['紅牌',p.red,'text-rose-500']].map(([k,v,c])=>(<div key={k} className="bg-slate-50 rounded-xl py-3"><div className={`text-2xl font-extrabold ${c}`}>{v}</div><div className="text-[11px] text-slate-400 mt-0.5">{k}</div></div>))}</div></div><a href={googleUrl(p.en||p.name)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-sm font-semibold transition"><Search className="w-4 h-4"/>Google 搜尋更多資料<ExternalLink className="w-4 h-4"/></a></div>);}

function TeamPage({code,onMatch,onPlayer}){const d=getDetails(code);const tm=matches.filter(m=>m.home===code||m.away===code).sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));const tp=players.filter(p=>p.code===code).sort((a,b)=>b.goals-a.goals);
  const[roster,setRoster]=useState(null);const[rLoading,setRLoading]=useState(false);
  useEffect(()=>{let on=true;setRoster(null);if(teams[code]&&teams[code].id){setRLoading(true);fetchTeamRoster(code).then(r=>{if(on){setRoster(r&&r.length?r:null);setRLoading(false);}});}return()=>{on=false;};},[code]);
  const squad= roster? roster.map(p=>({label:lineupLabel(p.name,p.short),raw:p.name,num:p.num,pos:p.pos})) : realSquad(code).map(n=>({label:displayName(n).cn||n,raw:n,num:'',pos:''}));
  const Section=({icon:Icon,title,children})=>(<div className="bg-white rounded-2xl border border-slate-200/70 p-4 mb-3"><h4 className="text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-1.5"><Icon className="w-4 h-4 text-emerald-600"/>{title}</h4>{children}</div>);
  return (<div><div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 mb-4 text-white flex items-center gap-4"><Flag code={code} cls="w-16 h-11"/><div><h3 className="text-2xl font-extrabold">{tname(code)}</h3><p className="text-xs opacity-90 mt-0.5">主教練：{d.coach}{groupOf(code)!=='—'?` · ${groupOf(code)} 組`:''}</p></div></div>
    {d.info&&<Section icon={Users} title="球隊簡介 / 近況"><p className="text-sm text-slate-600 leading-relaxed">{d.info}</p></Section>}
    {d.news&&<Section icon={Newspaper} title="最新消息"><ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">{d.news.map((n,i)=><li key={i}>{n}</li>)}</ul></Section>}
    {d.injuries&&<Section icon={Stethoscope} title="傷病名單"><ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">{d.injuries.map((n,i)=><li key={i}>{n}</li>)}</ul></Section>}
    {d.history&&<Section icon={Trophy} title="世界盃往績"><p className="text-sm text-slate-600">{d.history}</p></Section>}
    <Section icon={Users} title={`球員名單${roster?'（ESPN 即時）':''}`}>{rLoading?<div className="flex items-center gap-1.5 text-xs text-emerald-600"><RefreshCw className="w-3.5 h-3.5 animate-spin"/>正在載入名單…</div>:squad.length?<div className="grid grid-cols-2 gap-x-3 gap-y-1.5">{squad.map((p,i)=>{const pl=getPlayer(p.label)||getPlayer(p.raw);return <button key={i} onClick={()=>pl?onPlayer(pl):window.open(googleUrl(displayName(p.raw).en||p.raw),'_blank')} className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-1 -m-1 transition text-left min-w-0"><img src={avatar(p.raw+code)} className="w-6 h-6 rounded-full bg-slate-100 shrink-0" loading="lazy"/><span className="truncate text-sm"><NameTag raw={p.raw} main="text-slate-700"/></span>{p.num&&<span className="ml-auto text-[10px] text-slate-300 shrink-0">#{p.num}</span>}</button>;})}</div>:<span className="text-sm text-slate-400">名單即將公佈</span>}</Section>
    {tp.length>0&&<Section icon={Goal} title="球員數據（點擊查看資料）"><table className="w-full text-sm"><thead><tr className="text-xs text-slate-400 text-left"><th className="py-1">球員</th><th>入球</th><th>助攻</th><th>🟨</th><th>🟥</th></tr></thead><tbody>{tp.map((p,i)=><tr key={i} className="border-t border-slate-100"><td className="py-1.5"><button onClick={()=>onPlayer(p)} className="hover:underline"><NameTag raw={p.name} main="text-slate-700"/></button></td><td>{p.goals}</td><td>{p.assists}</td><td>{p.yellow}</td><td>{p.red}</td></tr>)}</tbody></table></Section>}
    <Section icon={Calendar} title="賽程與賽果"><div className="space-y-2.5">{tm.length?tm.map(m=><MatchCard key={m.id} m={m} onMatch={onMatch} onTeam={()=>{}}/>):<span className="text-sm text-slate-400">暫無相關賽程</span>}</div></Section>
  </div>);}

/* ============================================================ 淘汰賽對陣表（依官方對陣結構 · 32強連線式） ============================================================ */
/* ============================================================ 淘汰賽對陣表（依官方 32 強對陣 · Yahoo 運動） ============================================================ */
/* ============================================================ 淘汰賽對陣表（動態：上一輪 → 顯示「A 或 B 勝方」；再上一輪 → 待定） ============================================================ */
const leftR32=[
  {a:'GER',b:'PAR'},{a:'FRA',b:'SWE'},{a:'RSA',b:'CAN'},{a:'NED',b:'MAR'},
  {a:'POR',b:'CRO'},{a:'ESP',b:'AUT'},{a:'USA',b:'BIH'},{a:'BEL',b:'SEN'}
];
const rightR32=[
  {a:'BRA',b:'JPN'},{a:'CIV',b:'NOR'},{a:'MEX',b:'ECU'},{a:'ENG',b:'COD'},
  {a:'ARG',b:'CPV'},{a:'AUS',b:'EGY'},{a:'SUI',b:'ALG'},{a:'COL',b:'GHA'}
];

const KO_TIMES={
  R32:[
    '2026-06-28T18:00:00Z','2026-06-28T21:00:00Z','2026-06-29T18:00:00Z','2026-06-29T21:00:00Z',
    '2026-06-30T18:00:00Z','2026-06-30T21:00:00Z','2026-07-01T18:00:00Z','2026-07-01T21:00:00Z',
    '2026-07-02T18:00:00Z','2026-07-02T21:00:00Z','2026-07-03T18:00:00Z','2026-07-03T21:00:00Z',
    '2026-06-29T00:00:00Z','2026-06-30T00:00:00Z','2026-07-02T00:00:00Z','2026-07-03T00:00:00Z'
  ],
  R16:['2026-07-04T18:00:00Z','2026-07-04T21:00:00Z','2026-07-05T18:00:00Z','2026-07-05T21:00:00Z','2026-07-06T18:00:00Z','2026-07-06T21:00:00Z','2026-07-07T18:00:00Z','2026-07-07T21:00:00Z'],
  QF:['2026-07-09T18:00:00Z','2026-07-09T21:00:00Z','2026-07-10T18:00:00Z','2026-07-11T21:00:00Z'],
  SF:['2026-07-14T19:00:00Z','2026-07-15T19:00:00Z'],
  '3RD':'2026-07-18T19:00:00Z',F:'2026-07-19T19:00:00Z'
};

function koWinner(m){if(!m||m.status!=='finished')return null;return m.hs>m.as?m.home:(m.as>m.hs?m.away:null);}
function koLoser(m){if(!m||m.status!=='finished')return null;return m.hs<m.as?m.home:(m.as<m.hs?m.away:null);}
const fmtKO=(iso)=>{try{return new Intl.DateTimeFormat('zh-HK',{timeZone:HK_TZ,month:'numeric',day:'numeric'}).format(new Date(iso));}catch(e){return'';}};

function KORow({code,score,win,show}){const known=teams[code]&&(teams[code].iso||teams[code].logo);return (<div className="flex items-center justify-between gap-1 py-0.5"><span className="flex items-center gap-1 min-w-0"><Flag code={code} cls="w-4 h-3 shrink-0"/><span className={`truncate text-[11px] ${win?'font-extrabold text-slate-900':'text-slate-600'}`}>{known?tname(code):'待定'}</span></span>{show&&<span className={`text-[11px] font-bold tabular-nums shrink-0 ${win?'text-emerald-600':'text-slate-400'}`}>{score}</span>}</div>);}

function SideLabel({d,dark}){
  if(!d)d={kind:'tbd'};
  if(d.kind==='team')return (<div className="flex items-center gap-1 py-0.5"><Flag code={d.code} cls="w-4 h-3 shrink-0"/><span className="truncate text-[11px] font-medium" style={{color:dark?'#e0f2fe':'#334155'}}>{tname(d.code)}</span></div>);
  if(d.kind==='winner')return (<div className="text-[10px] font-semibold truncate leading-tight py-0.5" style={{color:dark?'#bae6fd':'#64748b'}}>{tname(d.a)} 或 {tname(d.b)} 勝方</div>);
  if(d.kind==='text')return (<div className="text-[10px] truncate leading-tight py-0.5" style={{color:dark?'rgba(255,255,255,0.7)':'#94a3b8'}}>{d.text}</div>);
  return (<div className="text-[10px] py-0.5" style={{color:dark?'rgba(255,255,255,0.6)':'#94a3b8'}}>待定</div>);
}

function KOCell({cell,onMatch,gold,time}){
  const m=cell&&cell.match;const parts=cell?cell.parts:null;
  const timeStr=time?`${fmtKO(time)} ${fmtTime(time)}`:'';
  if(m){
    const live=m.status==='live',done=m.status==='finished',show=live||done;const wH=done&&m.hs>m.as,wA=done&&m.as>m.hs;
    return (<button onClick={()=>onMatch(m)} className={`w-full rounded-lg border ${gold?'border-amber-400 ring-2 ring-amber-300':'border-white'} bg-white shadow-md hover:bg-slate-50 px-2 py-1.5 text-left transition`}>
      <div className="flex items-center justify-between text-[9px] mb-1 leading-none">
        {live?<span className="flex items-center gap-1 text-rose-600 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"/>{m.minute}'</span>:done?<span className="text-slate-400 font-semibold">完場</span>:<span className="text-slate-500 font-medium">{fmtKO(m.datetime)} {fmtTime(m.datetime)}</span>}
      </div>
      <KORow code={m.home} score={m.hs} win={wH} show={show}/>
      <KORow code={m.away} score={m.as} win={wA} show={show}/>
    </button>);
  }
  const a=parts?parts.a:{kind:'tbd'},b=parts?parts.b:{kind:'tbd'};
  const concrete=a.kind==='team'&&b.kind==='team';
  if(concrete){
    return (<div className={`rounded-lg border ${gold?'border-amber-400':'border-white/60'} bg-white shadow px-2 py-1.5`}>
      {timeStr&&<div className="text-[9px] text-center text-slate-500 mb-0.5 font-medium">{timeStr}</div>}
      <SideLabel d={a}/><SideLabel d={b}/>
    </div>);
  }
  return (<div className="rounded-lg border-2 border-dashed px-2 py-1.5" style={{borderColor:gold?'rgba(252,211,77,0.8)':'rgba(125,211,252,0.7)',background:gold?'rgba(120,53,15,0.45)':'rgba(15,23,42,0.55)'}}>
    {timeStr&&<div className="text-[9px] text-center mb-0.5 font-medium" style={{color:'rgba(255,255,255,0.7)'}}>{timeStr}</div>}
    <SideLabel d={a} dark/>
    <div className="text-[9px] text-center leading-none my-0.5" style={{color:'rgba(255,255,255,0.45)'}}>─ 對 ─</div>
    <SideLabel d={b} dark/>
  </div>);
}

function Bracket({onMatch}){
  const ko=matches.filter(m=>koRound(m)!=='GROUP');
  const usedIds=new Set();
  const findByTeams=(a,b)=>{if(!a||!b)return null;const f=ko.find(m=>!usedIds.has(m.id)&&((m.home===a&&m.away===b)||(m.home===b&&m.away===a)));if(f)usedIds.add(f.id);return f||null;};
  const winnerDesc=(cell)=>{if(!cell)return{kind:'tbd'};const w=koWinner(cell.match);if(w)return{kind:'team',code:w};if(cell.parts&&cell.parts.a.kind==='team'&&cell.parts.b.kind==='team')return{kind:'winner',a:cell.parts.a.code,b:cell.parts.b.code};return{kind:'tbd'};};
  const mkR32=(p)=>({match:findByTeams(p.a,p.b),parts:{a:{kind:'team',code:p.a},b:{kind:'team',code:p.b}}});
  const processRound=(prev)=>{const out=[];for(let j=0;j<Math.floor(prev.length/2);j++){const a=winnerDesc(prev[2*j]),b=winnerDesc(prev[2*j+1]);const match=(a.kind==='team'&&b.kind==='team')?findByTeams(a.code,b.code):null;out.push({match,parts:{a,b}});}return out;};

  const r32L=leftR32.map(mkR32),r32R=rightR32.map(mkR32);
  const r16L=processRound(r32L),r16R=processRound(r32R);
  const qfL=processRound(r16L),qfR=processRound(r16R);
  const sfL=processRound(qfL),sfR=processRound(qfR);
  const finCell=processRound([sfL[0],sfR[0]])[0];

  let thirdCell={match:null,parts:{a:{kind:'text',text:'準決賽敗方'},b:{kind:'text',text:'準決賽敗方'}}};
  const lL=koLoser(sfL[0]&&sfL[0].match),lR=koLoser(sfR[0]&&sfR[0].match);
  if(lL&&lR)thirdCell={match:findByTeams(lL,lR),parts:{a:{kind:'team',code:lL},b:{kind:'team',code:lR}}};

  const hasKO=ko.length>0;
  const Col=({title,date,cells,times})=>(<div className="flex flex-col flex-shrink-0" style={{width:138}}><div className="text-center mb-2"><div className="font-bold text-xs sm:text-sm" style={{color:'#ffffff'}}>{title}</div><div className="text-[10px]" style={{color:'rgba(255,255,255,0.6)'}}>{date}</div></div><div className="flex flex-col justify-around flex-1 gap-1.5">{cells.map((c,i)=><KOCell key={i} cell={c} onMatch={onMatch} time={times?times[i]:null}/>)}</div></div>);

  return (<div className="relative rounded-3xl overflow-hidden shadow-xl" style={{background:'linear-gradient(135deg,#0f2a5c 0%,#1e3a8a 45%,#0c2347 100%)'}}>
    <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)',backgroundSize:'40px 40px'}}></div>
    <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl" style={{background:'rgba(252,211,77,0.18)'}}></div>
    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{background:'rgba(56,189,248,0.18)'}}></div>
    <div className="relative p-5">
      <div className="flex items-center gap-2 mb-1" style={{color:'#ffffff'}}><Trophy className="w-5 h-5" style={{color:'#fcd34d'}}/><h3 className="font-extrabold text-lg">32 強淘汰賽對陣表</h3></div>
      <p className="text-xs mb-1" style={{color:'rgba(255,255,255,0.8)'}}>對陣依官方賽程排定。每場分出勝負後，下一輪會自動顯示晉級者；再下一輪則先以「○ 或 ○ 勝方」標示，更遠輪次顯示待定。</p>
      {!hasKO&&<p className="text-xs mb-3" style={{color:'#fde68a'}}>淘汰賽尚未開打，現顯示固定對陣與預定賽期。</p>}
      <div className="overflow-x-auto pb-2 pt-2">
        <div className="flex gap-2 items-stretch min-w-max" style={{minHeight:440}}>
          <Col title="32強" date="6/28–7/3" cells={r32L} times={KO_TIMES.R32.slice(0,8)}/>
          <Col title="16強" date="7/4–7" cells={r16L} times={KO_TIMES.R16.slice(0,4)}/>
          <Col title="半準決賽" date="7/9–11" cells={qfL} times={KO_TIMES.QF.slice(0,2)}/>
          <Col title="準決賽" date="7/14" cells={[sfL[0]]} times={[KO_TIMES.SF[0]]}/>
          <div className="flex flex-col items-center justify-center flex-shrink-0 px-1" style={{width:166}}>
            <Trophy className="w-12 h-12 mb-1 drop-shadow" style={{color:'#fcd34d'}}/>
            <div className="font-extrabold text-sm" style={{color:'#fcd34d'}}>決賽</div>
            <div className="text-[10px] mb-2" style={{color:'rgba(255,255,255,0.6)'}}>7/19</div>
            <div className="w-full"><KOCell cell={finCell} onMatch={onMatch} gold time={KO_TIMES.F}/></div>
            <div className="mt-5 font-semibold text-[11px] mb-1" style={{color:'rgba(255,255,255,0.7)'}}>季軍戰 · 7/18</div>
            <div className="w-full"><KOCell cell={thirdCell} onMatch={onMatch} time={KO_TIMES['3RD']}/></div>
          </div>
          <Col title="準決賽" date="7/15" cells={[sfR[0]]} times={[KO_TIMES.SF[1]]}/>
          <Col title="半準決賽" date="7/9–11" cells={qfR} times={KO_TIMES.QF.slice(2,4)}/>
          <Col title="16強" date="7/4–7" cells={r16R} times={KO_TIMES.R16.slice(4,8)}/>
          <Col title="32強" date="6/28–7/3" cells={r32R} times={KO_TIMES.R32.slice(8,16)}/>
        </div>
      </div>
    </div>
  </div>);
}
function DayChips({days,value,onChange,todayHasNone}){const tk=todayKey();return (<div className="flex gap-2 overflow-x-auto pb-3"><button onClick={()=>onChange('today')} className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition ${value==='today'?'bg-emerald-600 text-white shadow':'bg-white border border-slate-200 text-slate-600'}`}>今天{todayHasNone?'·順延':''}</button><button onClick={()=>onChange('all')} className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition ${value==='all'?'bg-emerald-600 text-white shadow':'bg-white border border-slate-200 text-slate-600'}`}>全部</button>{days.filter(d=>d!==tk).map(d=>(<button key={d} onClick={()=>onChange(d)} className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition ${value===d?'bg-emerald-600 text-white shadow':'bg-white border border-slate-200 text-slate-600'}`}>{dayLabel(d)}</button>))}</div>);}

export default function WorldCupHub(){
  const[dataVersion,setDataVersion]=useState(0);const[apiStatus,setApiStatus]=useState('loading');const[reloadKey,setReloadKey]=useState(0);
  const loadAll=useCallback(async()=>{setApiStatus(s=>s==='live'?'live':'loading');const[ms,st]=await Promise.all([fetchAllMatches(),fetchStandings()]);if(st.ok){STANDINGS.groups=st.groups;STANDINGS.codeGroup=st.codeGroup;}let live=false;if(ms.ok&&ms.matches.length){matches=ms.matches;matches.forEach(m=>{if(m.round==='GROUP')m.group=groupOf(m.home);});REAL_SCORERS=ms.scorers||[];live=true;}setApiStatus(live||st.ok?'live':'demo');setDataVersion(v=>v+1);},[]);
  useEffect(()=>{let alive=true;(async()=>{if(alive)await loadAll();})();const t=setInterval(()=>{if(alive)loadAll();},60000);return()=>{alive=false;clearInterval(t);};},[loadAll,reloadKey]);
  const upcoming=useMemo(()=>matches.filter(m=>m.status!=='finished').sort((a,b)=>new Date(a.datetime)-new Date(b.datetime)),[dataVersion]);
  const finished=useMemo(()=>matches.filter(m=>m.status==='finished').sort((a,b)=>new Date(b.datetime)-new Date(a.datetime)),[dataVersion]);
  const live=useMemo(()=>matches.filter(m=>m.status==='live').sort((a,b)=>new Date(a.datetime)-new Date(b.datetime)),[dataVersion]);
  const fxDays=useMemo(()=>Array.from(new Set(upcoming.map(localDay))).sort(),[upcoming]);
  const reDays=useMemo(()=>Array.from(new Set(finished.map(localDay))).sort().reverse(),[finished]);
  const[tab,setTab]=useState('home');const[selMatch,setSelMatch]=useState(null);const[selTeam,setSelTeam]=useState(null);const[selPlayer,setSelPlayer]=useState(null);const[q,setQ]=useState('');const[fxDay,setFxDay]=useState('today');const[reDay,setReDay]=useState('today');
  const nextMatch=upcoming.find(m=>m.status==='upcoming');
  const recentDays=useMemo(()=>Array.from(new Set(finished.map(localDay))).sort().reverse().slice(0,2),[finished]);
  const recentResults=finished.filter(m=>recentDays.includes(localDay(m)));
  const upOnly=upcoming.filter(m=>m.status==='upcoming');const upDays=Array.from(new Set(upOnly.map(localDay))).sort().slice(0,2);const upcomingShown=upOnly.filter(m=>upDays.includes(localDay(m)));
  const gkeys=groupKeys();
  const thirds=useMemo(()=>gkeys.map(g=>{const r=computeStandings(g);return r[2]?{g,...r[2]}:null;}).filter(Boolean).sort((a,b)=>b.Pts-a.Pts||b.GD-a.GD||b.GF-a.GF),[dataVersion]);
  const qualThirds=useMemo(()=>new Set(thirds.slice(0,8).map(t=>t.code)),[thirds]);
  const scorers=useMemo(()=> REAL_SCORERS.length? REAL_SCORERS.map(s=>({...s,demo:getPlayer(s.name)})):players.map(p=>({name:p.name,code:p.code,goals:p.goals,assists:p.assists,demo:p})),[dataVersion]);
  const searchResults=useMemo(()=>{if(!q.trim())return null;const ql=q.toLowerCase();return{teamHits:Object.keys(teams).filter(c=>(teams[c].name||'').includes(q)||(teams[c].en||'').toLowerCase().includes(ql)),playerHits:players.filter(p=>p.name.includes(q)||(p.en&&p.en.toLowerCase().includes(ql)))};},[q,dataVersion]);
  const openTeam=(c)=>{setSelMatch(null);setSelPlayer(null);setSelTeam(c);};
  const openPlayer=(p)=>{setSelTeam(null);setSelMatch(null);setSelPlayer(p);};
  const openMatch=async(m)=>{setSelTeam(null);setSelPlayer(null);setSelMatch(m);if(apiStatus==='live'&&m.espnId&&!m._detail&&m.status!=='upcoming'){const d=await fetchMatchDetail(m.espnId,m.home,m.away);if(d&&(d.events||d.stats||d.lineups)){const patch={...(d.events?{events:d.events}:{}),...(d.stats?{stats:d.stats}:{}),...(d.lineups?{lineups:d.lineups}:{}),_detail:true};const idx=matches.findIndex(x=>x.id===m.id);if(idx>=0)matches[idx]={...matches[idx],...patch};setSelMatch(cur=>(cur&&cur.id===m.id)?{...cur,...patch}:cur);}}};
  const tabs=[{id:'home',label:'首頁',icon:Clock},{id:'fixtures',label:'賽程',icon:Calendar},{id:'results',label:'賽果',icon:ListChecks},{id:'standings',label:'小組積分',icon:BarChart3},{id:'thirds',label:'最佳第三',icon:Award},{id:'knockout',label:'淘汰賽',icon:Trophy},{id:'scorers',label:'射手榜',icon:Goal}];
  const rowAccent=(i,code)=> i<2?'border-l-4 border-l-emerald-400':i===2?(qualThirds.has(code)?'border-l-4 border-l-amber-400':'border-l-4 border-l-rose-300'):'border-l-4 border-l-rose-300';
  const tk=todayKey();
  const todayHasFx=fxDays.includes(tk);const fxFirstDay=todayHasFx?tk:(fxDays[0]||tk);const fxActive=fxDay==='today'?fxFirstDay:fxDay;const fxList=upcoming.filter(m=>fxDay==='all'||localDay(m)===fxActive);
  const todayHasRe=reDays.includes(tk);const reFirstDay=todayHasRe?tk:(reDays[0]||tk);const reActive=reDay==='today'?reFirstDay:reDay;const reList=[...live,...finished.filter(m=>reDay==='all'||localDay(m)===reActive)];
  const statusText=apiStatus==='live'?'即時數據（ESPN）已連線':apiStatus==='demo'?'示範數據 · 沙盒封鎖外部請求，部署後自動連線':'連線 ESPN 中…';
  const statusDot=apiStatus==='live'?'bg-emerald-300':apiStatus==='demo'?'bg-amber-300':'bg-sky-300 animate-pulse';

  return (<div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
    <header className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white shadow-lg"><div className="max-w-6xl mx-auto px-4 py-5"><div className="flex items-center gap-3 mb-4"><div className="w-11 h-11 rounded-2xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center backdrop-blur"><Trophy className="w-6 h-6"/></div><div className="flex-1 min-w-0"><h1 className="text-xl font-extrabold leading-tight tracking-tight">2026 世界盃資訊站</h1><p className="text-xs opacity-80 mt-0.5">由 Lody Wong 製作 · 時間為香港時間（GMT+8）</p><div className="flex items-center gap-2 mt-1 text-[11px]"><span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span><span className="opacity-85 truncate">{statusText}</span><button onClick={()=>setReloadKey(k=>k+1)} className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 rounded-full px-2 py-0.5 transition"><RefreshCw className={`w-3 h-3 ${apiStatus==='loading'?'animate-spin':''}`}/>重試</button></div></div></div>
      <div className="relative"><Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="搜尋球隊或球員（中／英）…" className="w-full pl-10 pr-3 py-2.5 rounded-xl text-slate-800 text-sm bg-white outline-none shadow-sm focus:ring-2 focus:ring-white/50"/>{searchResults&&(<div className="absolute z-30 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 max-h-72 overflow-y-auto">{searchResults.teamHits.length===0&&searchResults.playerHits.length===0&&<div className="p-3 text-sm text-slate-400">找不到結果</div>}{searchResults.teamHits.map(c=>(<button key={c} onClick={()=>{openTeam(c);setQ('');}} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 text-slate-800 text-sm"><Flag code={c} cls="w-6 h-4"/>{tname(c)}<span className="ml-auto text-xs text-slate-400">球隊</span></button>))}{searchResults.playerHits.map((p,i)=>(<button key={i} onClick={()=>{openPlayer(p);setQ('');}} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 text-slate-800 text-sm"><img src={avatar(p.name+p.code)} className="w-6 h-6 rounded-full bg-slate-100"/><NameTag raw={p.name}/><span className="ml-auto text-xs text-slate-400">{tname(p.code)}</span></button>))}</div>)}</div></div>
      <nav className="max-w-6xl mx-auto px-2 flex overflow-x-auto">{tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-1.5 px-3.5 py-3 text-sm whitespace-nowrap border-b-2 transition ${tab===t.id?'border-white font-bold':'border-transparent opacity-70 hover:opacity-100'}`}><t.icon className="w-4 h-4"/>{t.label}</button>))}</nav></header>

    <main className="max-w-6xl mx-auto px-4 py-6">
      {tab==='home'&&(<div>{nextMatch&&(<div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-3xl p-5 mb-5 shadow-xl"><div className="flex items-center gap-1.5 text-xs opacity-80 mb-3"><Clock className="w-4 h-4"/>距離下一場比賽</div><div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between"><Countdown target={nextMatch.datetime}/><button onClick={()=>openMatch(nextMatch)} className="bg-white/10 backdrop-blur rounded-2xl p-3 text-left hover:bg-white/20 transition ring-1 ring-white/15"><div className="flex items-center gap-2"><Flag code={nextMatch.home}/><span className="font-semibold text-sm">{tname(nextMatch.home)}</span><span className="opacity-60 text-xs">vs</span><span className="font-semibold text-sm">{tname(nextMatch.away)}</span><Flag code={nextMatch.away}/></div><div className="text-xs opacity-70 mt-1.5">{fmtDate(nextMatch.datetime)} {fmtTime(nextMatch.datetime)} · {nextMatch.venue}</div></button></div></div>)}<button onClick={()=>setTab('standings')} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md rounded-2xl py-3.5 mb-6 text-sm font-semibold text-slate-700 transition"><BarChart3 className="w-5 h-5 text-emerald-600"/>查看小組積分榜</button>{live.length>0&&(<><h2 className="text-lg font-bold mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>正在進行</h2><div className="grid sm:grid-cols-2 gap-3 mb-6">{live.map(m=><MatchCard key={m.id} m={m} onMatch={openMatch} onTeam={openTeam}/>)}</div></>)}<h2 className="text-lg font-bold mb-3 flex items-center gap-2"><ListChecks className="w-5 h-5 text-emerald-600"/>最近賽果</h2>{recentResults.length?<div className="grid sm:grid-cols-2 gap-3 mb-6">{recentResults.map(m=><MatchCard key={m.id} m={m} onMatch={openMatch} onTeam={openTeam}/>)}</div>:<p className="text-sm text-slate-400 mb-6">暫無賽果。</p>}<h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-600"/>即將開賽</h2>{upcomingShown.length?<div className="grid sm:grid-cols-2 gap-3">{upcomingShown.map(m=><MatchCard key={m.id} m={m} onMatch={openMatch} onTeam={openTeam}/>)}</div>:<p className="text-sm text-slate-400">暫無即將開賽的比賽。</p>}</div>)}

      {tab==='fixtures'&&(<div><h2 className="text-lg font-bold mb-3">賽程（未來比賽）</h2><DayChips days={fxDays} value={fxDay} onChange={setFxDay} todayHasNone={fxDay==='today'&&!todayHasFx&&fxList.length>0}/>{fxDay==='today'&&!todayHasFx&&fxList.length>0&&<p className="text-xs text-slate-400 mb-2">今天沒有未開賽的比賽，已自動顯示最近一天（{dayLabel(fxActive)}）。</p>}{fxList.length?<div className="grid sm:grid-cols-2 gap-3">{fxList.map(m=><MatchCard key={m.id} m={m} onMatch={openMatch} onTeam={openTeam}/>)}</div>:<p className="text-sm text-slate-400">沒有未開賽的比賽。</p>}</div>)}

      {tab==='results'&&(<div><h2 className="text-lg font-bold mb-3">賽果</h2><DayChips days={reDays} value={reDay} onChange={setReDay} todayHasNone={reDay==='today'&&!todayHasRe&&finished.length>0}/>{reDay==='today'&&!todayHasRe&&finished.length>0&&<p className="text-xs text-slate-400 mb-2">今天暫無賽果，已自動顯示最近一天（{dayLabel(reActive)}）。</p>}{live.length>0&&<p className="text-xs font-semibold text-rose-500 mb-2 flex items-center gap-1.5"><span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>進行中的比賽已置頂</p>}{reList.length?<div className="grid sm:grid-cols-2 gap-3">{reList.map(m=><MatchCard key={m.id} m={m} onMatch={openMatch} onTeam={openTeam}/>)}</div>:<p className="text-sm text-slate-400">暫無賽果。</p>}<p className="text-xs text-slate-400 mt-3">提示：點中間比分查看陣容圖、賽事數據與該組積分。</p></div>)}

      {tab==='standings'&&(<div className="grid sm:grid-cols-2 gap-4">{gkeys.map(g=>{const rows=computeStandings(g);return (<div key={g} className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm"><div className="bg-slate-50 px-4 py-2.5 font-bold text-sm border-b border-slate-100">{g} 組</div><StandingsTable rows={rows} onTeam={openTeam} accent={rowAccent}/></div>);})}<div className="text-xs text-slate-500 sm:col-span-2 flex flex-wrap gap-4 bg-white rounded-2xl border border-slate-200/70 p-3"><span className="flex items-center gap-1.5"><span className="inline-block w-1 h-4 bg-emerald-400 rounded-full"></span>直接晉級（前二）</span><span className="flex items-center gap-1.5"><span className="inline-block w-1 h-4 bg-amber-400 rounded-full"></span>最佳第三名（暫晉級）</span><span className="flex items-center gap-1.5"><span className="inline-block w-1 h-4 bg-rose-300 rounded-full"></span>暫遭淘汰</span></div></div>)}

      {tab==='thirds'&&(<div><div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-2xl p-4 mb-4 shadow-sm"><h2 className="font-bold flex items-center gap-1.5"><Award className="w-5 h-5"/>最佳第三名爭奪</h2><p className="text-xs opacity-90 mt-1">各小組第三名互相比較，成績最佳的 <b>8 隊</b> 晉級。</p></div><div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm"><table className="w-full text-sm"><thead><tr className="text-[11px] text-slate-400 bg-slate-50"><th className="text-left px-3 py-2.5 font-medium">排名</th><th className="text-left font-medium">球隊</th><th className="w-9 font-medium">組</th><th className="w-9 font-medium">賽</th><th className="w-12 font-medium">得失</th><th className="w-10 font-medium">入球</th><th className="w-10 pr-3 font-medium">分</th></tr></thead><tbody>{thirds.length?thirds.map((r,i)=>(<tr key={r.code} className={`border-t border-t-slate-100 ${i<8?'border-l-4 border-l-emerald-400':'border-l-4 border-l-rose-300'}`}><td className="px-3 py-2.5 font-bold text-slate-500">{i+1}</td><td><button onClick={()=>openTeam(r.code)} className="flex items-center gap-1.5 hover:text-emerald-600"><Flag code={r.code} cls="w-5 h-3.5"/><span className="font-medium truncate">{tname(r.code)}</span></button></td><td className="text-center text-xs text-slate-400">{r.g}</td><td className="text-center text-slate-500 tabular-nums">{r.P}</td><td className="text-center text-xs text-slate-500 tabular-nums">{r.GD>0?`+${r.GD}`:r.GD}</td><td className="text-center text-slate-500 tabular-nums">{r.GF}</td><td className="text-center font-bold pr-3 tabular-nums">{r.Pts}</td></tr>)):<tr><td colSpan={7} className="text-center text-sm text-slate-400 py-6">小組賽尚未產生第三名數據。</td></tr>}</tbody></table></div><p className="text-xs text-slate-500 mt-3 flex gap-4"><span className="flex items-center gap-1.5"><span className="inline-block w-1 h-4 bg-emerald-400 rounded-full"></span>前 8 晉級</span><span className="flex items-center gap-1.5"><span className="inline-block w-1 h-4 bg-rose-300 rounded-full"></span>暫遭淘汰</span></p></div>)}

      {tab==='knockout'&&(<div><Bracket onMatch={openMatch}/></div>)}

      {tab==='scorers'&&(<div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm"><div className="bg-slate-50 px-4 py-2.5 font-bold text-sm flex items-center gap-1.5 border-b border-slate-100"><Goal className="w-4 h-4 text-emerald-600"/>射手榜 {REAL_SCORERS.length?<span className="text-[10px] font-normal text-emerald-600 ml-1">即時數據</span>:<span className="text-[10px] font-normal text-amber-500 ml-1">示範數據</span>}</div><table className="w-full text-sm"><thead><tr className="text-[11px] text-slate-400"><th className="text-left px-3 py-2.5 font-medium">#</th><th className="text-left font-medium">球員</th><th className="font-medium">入球</th><th className="pr-3 font-medium">助攻</th></tr></thead><tbody>{scorers.length?scorers.map((p,i)=>(<tr key={i} className="border-t border-slate-50 hover:bg-slate-50"><td className="px-3 py-2.5 font-bold text-slate-400">{i+1}</td><td><button onClick={()=>p.demo?openPlayer(p.demo):window.open(googleUrl(displayName(p.name).en||p.name),'_blank')} className="flex items-center gap-2 hover:text-emerald-600"><img src={avatar(p.name+p.code)} className="w-7 h-7 rounded-full bg-slate-100"/><Flag code={p.code} cls="w-5 h-3.5"/><NameTag raw={p.name} main="text-slate-700"/></button></td><td className="text-center font-bold text-emerald-600">{p.goals}</td><td className="text-center text-slate-500 pr-3">{p.assists}</td></tr>)):<tr><td colSpan={4} className="text-center text-sm text-slate-400 py-6">尚無入球數據。</td></tr>}</tbody></table></div>)}
    </main>

    {selMatch&&<Modal onClose={()=>setSelMatch(null)}><MatchDetail m={selMatch} onTeam={openTeam} onPlayer={openPlayer}/></Modal>}
    {selTeam&&<Modal onClose={()=>setSelTeam(null)}><TeamPage code={selTeam} onMatch={openMatch} onPlayer={openPlayer}/></Modal>}
    {selPlayer&&<Modal onClose={()=>setSelPlayer(null)}><PlayerPage p={selPlayer}/></Modal>}
    <footer className="text-center text-xs text-slate-400 py-8">2026 世界盃資訊站 · 由 Lody Wong 製作 · 時間為香港時間（GMT+8）</footer>
  </div>);
}
