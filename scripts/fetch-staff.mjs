// One-off: pull the real Mit-Mak staff directory (names, roles, photos) from the
// live portal, download each headshot into public/staff/, and emit data/staff.ts.
// Run: node scripts/fetch-staff.mjs
import fs from 'fs';
import path from 'path';
import https from 'https';

const BASE = 'https://portal.mitmakmotors.online/staff/images/';
const OUT_DIR = 'public/staff';

// dept | name | role | imageFile   (order here = render order)
const RAW = `
Leadership|Bobby Petkov|Group CEO|image_6784def8768fa8.63129354.png
Leadership|Dimitri Petkov|Founder|image_67c992e675e2c6.75112940.png
Leadership|Maria Petkova|Owner|image_67b38167668d89.78094480.png
Leadership|Elena Petkova|Marketing Manager|image_67c9935dabaa81.25134142.png
Sales Executives|Eugene Beukes|Sales Executive|image_69c4ff37ec8753.73412402.png
Sales Executives|Edward Magane|Sales Executive|image_68e61114954490.72863174.png
Mit-Mak Floor 1|Mahlatsi Nkoana|Sales Executive|image_6968b2160263b9.93910715.png
Mit-Mak Floor 1|Joseph Malope|Sales Executive|image_67bda4dd6e8419.08757199.png
Mit-Mak Floor 1|Louis Mogohlwane|Sales Executive|image_690090f87fa4a6.89172671.png
Mit-Mak Floor 1|Vusumuzi Bosman|Sales Executive|image_69008fe2903d39.25913414.png
Mit-Mak Floor 1|Celia Roos|Human Resources Manager|image_68e6245f85b160.94561664.png
Mit-Mak Floor 1|Chikita Matjila|Floor Controller|image_67b4d6883c7fe3.17570807.png
Mit-Mak Floor 1|Lawrence Sayidi|Cafe|image_67b4df6abb4eb2.89347089.png
Mit-Mak Floor 1|Nhlanhla Mbele|Mit-Mak Cafe Chef|image_67b4dfd8ad9f33.94764043.png
Mit-Mak Floor 2|Naas Rossouw|Branch Manager|image_6784e268a23bb2.57108445.png
Mit-Mak Floor 2|TT Mhangwane|Sales Executive|image_69c3b4f86ebe35.21897844.png
Mit-Mak Floor 2|Peter Ndlela|Sales Executive|image_67bda570791f21.70708083.png
Mit-Mak Floor 2|Heinrich du Plessis|Sales Executive|image_68e6142e9a8f38.39121374.png
Mit-Mak Floor 3|Armand Bester|Sales Executive|image_69008e958d7e63.03255818.png
Mit-Mak Floor 3|Blessmore Chinowawa|Sales Executive|image_6900990ac0f7b4.10159120.png
Mit-Mak Floor 3|Nyiko Mabasa|Cadet|image_67bda48b5348b0.26189754.png
Mit-Mak Floor 4|Rayno Wehmeyer|Branch Manager|image_6784e1dce335e8.89941652.png
Mit-Mak Floor 4|Omphile Matsei|Sales Executive|image_69c3ad7b228f02.76025054.png
Mit-Mak Floor 4|JJ Pholo|Sales Executive|image_67bda3f2216ae0.16717648.png
Mit-Mak Floor 5|Rendani Mafuna|Sales Executive|image_69c3a6c5e160a6.62863263.png
Mit-Mak Floor 5|Keschaan Slinger|Sales Executive|image_6968b1d321a380.15050231.png
Mit-Mak Floor 5|Divan Coetzee|Sales Executive|image_67bda687a02c23.01251671.png
Marketing|Megan Flanagan|Sales & Marketing Administrator|image_69c4ff8badc419.24398082.png
Marketing|Jayden Makue|Marketing Assistant|image_69c4fff720a7e3.75933873.png
Marketing|Izelme Rossouw|Marketing|image_68e627d8022c88.51040435.png
Marketing|Elzie Janse van Rensburg|Marketing|image_695cf29d86f606.22807118.png
Marketing|Kamohelo Tsoeli|Marketing Assistant|image_695d280ab382b8.90845613.png
Buying|Stefan Mostert (Mossie)|Buying Manager|image_67bdaf180f3a74.77966827.png
Buying|George Kaloianov|Buyer 2IC|image_67c71a1a245327.35874467.png
Buying|Marco da Silva|Buyer, Cape Town|image_67c841812bd869.93547382.png
Buying|Gareth Pickett|Buyer, Johannesburg|image_67c98155c492c9.50379362.png
Buying|Preva Govender|Buyer|image_67c9be0b3d6253.42125780.png
Buying|Bertie Bornman|Buyer|image_67d2b9534b7956.44768540.png
Buying|Junaid Myburgh|Buyer|image_695cf68ccb1ee6.32935872.png
Buying|Enrike Mienie|Buyer, Call Centre Agent|image_67c99e0e17cd14.55056104.png
Buying|Damian Bester|Buyer, Call Centre Agent|image_695e1610d50ab9.36702792.png
Finance & Insurance|Eduan Hattingh|Qualified F&I|image_6996eeb2375cb2.90979636.png
Finance & Insurance|Tercia Hughes|F&I Signing Manager|image_67c6a7464d30e1.01990408.png
Finance & Insurance|Charles Laine|Qualified F&I|image_67c6a9f4d1f9c0.28763864.png
Finance & Insurance|Caroline Moll|Qualified F&I|image_67c6aa6c8619b9.78716071.png
Finance & Insurance Assistants|Megan Blom|Data Capturer|image_67d2b5f6ac0451.07549090.png
Finance & Insurance Assistants|Albert Visser|Finance & Insurance Assistant|image_67c6a9dcbcf487.75467312.png
Finance & Insurance Assistants|Zene Halgreen|Finance & Insurance Assistant|image_67c6aa4b921d73.24124912.png
Finance & Insurance Assistants|Monique Groenewald|Finance & Insurance Assistant|image_67c6aaa46d6453.90105637.png
Finances|Anneke Coetzee|Financial Manager|image_68dfe21109ec48.25568100.png
Finances|Hesme Geyser|Administrator|image_6968b14a6c7d69.63071531.png
Finances|Doenell Jansen|Finances|image_67c6eabc7b99a8.50689420.png
Finances|Jacqualine Jacobs|Administrator|image_67c9915faeb0f5.64918772.png
Call Centre|Carmen Hartzenberg|Call Centre Manager|image_68dfebda99bd10.18944044.png
Call Centre|Keegan Ah-Dong|Call Centre Agent|image_6900cdb29a12d0.12962542.png
Call Centre|Lerato Tshotetsi|Call Centre Agent|image_6900cda92fb7e0.15952507.png
Call Centre|Perseverance Munyai|Call Centre Agent|image_69ce306105c938.36921083.png
Call Centre|Amanda Mthimunye|Call Centre Agent|image_69ce307a685d88.26292587.png
Call Centre|Nomsa Mkhize|Call Centre Agent|image_6900c93b26d8c6.48522852.png
Call Centre|Ryian Joseph|Call Centre Agent|image_67c6ad15bc5290.95583.png
Call Centre|Monique Mariano|Call Centre Agent|image_67c6ad59a7cc30.31272501.png
Call Centre|Jeane Cronje|Call Centre Agent|image_67c6e6a88f31b3.89765817.png
Call Centre|Lucas Mfolo|Call Centre Agent|image_6900c9c1d6a374.82511887.png
Call Centre|Jessica Coetzer|Call Centre Agent|image_67c6e812726459.84972774.png
Call Centre|Michelle Venter|Call Centre Agent|image_67c6e889254366.69917402.png
CRM|Giselle Mc Intosh|CRM Supervisor|image_67b4d3580da3e0.03351534.png
CRM|Chenelle Bothma|CRM 2IC & Condition Report Administrator|image_67c6ed7d5ff4b9.36142479.png
CRM|Hennie Esterhuizen|Service Advisor|image_67b4d238d4ec52.33055736.png
CRM|Micheal Mabitsela|CRM / Workshop Driver|image_67b4d62dcf9f08.13169871.png
CRM|Wianka van Helsdingen|CRM Specialist|image_67c6ed3620af09.82308722.png
Recon|Chantel Camara|Recon Administrator|image_67b4d2725f3b40.04477060.png
Recon|Jason Britz|Recon Assistant|image_67b4d2c770ba82.17932606.png
Recon|Solomon Maisa|Recon: Cosmetic Parts Procurement|image_67bda5f42c2639.80576688.png
Recon|Zwelithini Chabalala|Recon: Polisher|image_696b3e5595d929.96287703.png
Recon|Banele Vuma|Recon: Polisher|image_67b4de97458659.07961813.png
Depot & Workshop|Henry Hughes|Manager: Depot, Recon & Workshop|image_67c6ebb32275c1.75297001.png
Depot & Workshop|Lesedi Mokgosi|PDI & Workshop Operations Manager|image_67b4d2f64171d3.13612399.png
Depot & Workshop|Rohan Swart|Workshop 2IC|image_67b4d48c2492a4.00263629.png
Depot & Workshop|Siphesihle Maseko|Depot Receptionist|image_6900d03d0c8ec4.70330545.png
Depot & Workshop|Pearl Ndlovu|Administrator|image_69c500249111b5.27499100.png
Depot & Workshop|Carel Bekker|Qualified Motor Mechanic|image_67b4d3967d6d93.42719450.png
Depot & Workshop|Mfundo Ngwenya|Qualified Motor Mechanic|image_67b73c87708421.90971948.png
Depot & Workshop|Brandon Kitching|Parts Controller|image_67b4d3e12448c1.41278083.png
Depot & Workshop|Jaco Groenewald|Workshop Technician|image_67b4d4179adbe6.28821174.png
Depot & Workshop|Frikkie van Dyk|Workshop Technician|image_67b4d454dec0c8.82599247.png
Depot & Workshop|Albert Toruvandepi|Workshop Technician|image_67b4de271586c0.35899137.png
Depot & Workshop|Jan Scholtemeijer|Workshop Technician|image_67b4de5524e192.93276051.png
Depot & Workshop|Evans Jani|Workshop Technician|image_67b4e3111285e4.61793799.png
Depot & Workshop|Hennie Minnaar|Workshop Parts Driver|image_67b4d6bbdcfba2.35905368.png
Depot & Workshop|Tumelo Nkuna|Cleaner|image_67b4e08d9c51a5.51633888.png
Depot & Workshop|Alpheus Marakalala|Cleaner|image_67b4e24e12f676.91906148.png
Depot & Workshop|Thabang Mathebula|Cleaner|image_67b4e41ff01b59.37689280.png
Wash Bay|Kurula Sithole|Cleaner|image_67cabfc9ca4eb7.24088874.png
Wash Bay|Simon Mogoru|Cleaner|image_67cac1081f0ec0.37365764.png
Wash Bay|Tumiso Manamela|Cleaner|image_696b2baea96af4.03119746.png
Wash Bay|Pontsho Mashilo|Cleaner|image_696b2d74e8abd9.35190983.png
Wash Bay|Kleinboy Rangongo|Cleaner|image_696b2ede4652d0.35725785.png
Wash Bay|Tlhokwa Bontsi|Cleaner|image_696b3b9844b171.18874084.png
Wash Bay|Kamogelo Mokonyane|Cleaner|image_69eb1b717a04c9.59509248.png
Wash Bay|Kamogelo Makena|Cleaner|image_69eb1bb5ce7f98.38419084.png
Wash Bay|Dineo Ndala|Cleaner|image_69eb1bd27d3d44.27847744.png
Wash Bay|Tumo Mosweu|Cleaner|image_67b4e0da733c99.85869479.png
Wash Bay|Happy Mfulwane|Cleaner|image_67b4e134dcbbe1.86403144.png
Wash Bay|Patrick Morweng|Cleaner|image_67b4e186ab7038.90222809.png
Wash Bay|Lizzy Ditle|Cleaner|image_67c71d24d09be7.47646114.png
Wash Bay|Lusana Machebe|Cleaner|image_67b4e0131633c3.07382173.png
Wash Bay|Milton Khoza|Cleaner|image_67b4e035e07c42.47753226.png
Wash Bay|Jacob Mosia|Cleaner|image_67b4e54cb1e900.27109122.png
Wash Bay|Ishmael Simelane|Cleaner|image_67c9959424e0b1.14581042.png
Drivers|Buthelezi Mpho Francis|Driver|image_696b3cc26e42b1.79897952.png
Drivers|James Mojelele|Driver|image_69eb1b301679e0.74102958.png
Drivers|James Manganye|Driver|image_67b4d7edf3c9c9.60269589.png
Drivers|Jack Aphane|Driver|image_67b4dca6ef3880.95158542.png
Drivers|Hans Strydom|Driver|image_67b4dd7988b311.91143.png
Logistics|Sello Mathonsi|Natis Controller|image_6968b2876f0186.15623924.png
Logistics|Nikita Kelly|Administrator|image_697874a47b33b4.44756600.png
Logistics|Cecilia van Staden|Workshop Costing Clerk, Logistics|image_67c6e9f17ae451.55929155.png
Cadet Program|Lethabo Magopa|Sales Executive|image_6900962e247807.41797405.png
Cadet Program|Sindie Moolman|Cadet|image_6900a001bbc394.33847115.png
Cadet Program|Vutomi Mbungana|Cadet|image_69c3a755c78b41.74528734.png
Cadet Program|Garth Mahlakoane|Cadet|image_69c3ad002df317.26270128.png
Cadet Program|Halle Khazamula|Cadet|image_69c3b20ed01ad3.21317136.png
Cadet Program|Charity Nyakane|Cadet|image_69c3b22aea3be8.47080989.png
Cadet Program|Nelson Sibiya|Cadet|image_69c3c54227da76.42022295.png
Cadet Program|Kealeboga Ndlovu|Cadet|image_69c3bb7d9865c2.23135649.png
Cadet Program|Jason Louw|Cadet|image_69c3bb928f1370.76685668.png
Cadet Program|Osego Khomo|Cadet|image_67c71b24e66073.34319150.png
Cadet Program|Tshidiso Mogale|Cadet|image_67bdad6dd06c79.12805181.png
Support|Richie|Handyman|image_67b73bd0925b42.12640038.png
Support|Klass Mofokeng|Security|image_67c995e1461f22.16013902.png
`;

fs.mkdirSync(OUT_DIR, { recursive: true });

const rows = RAW.trim().split('\n').map((l) => l.split('|').map((s) => s.trim()));

function download(file) {
  return new Promise((resolve) => {
    const dest = path.join(OUT_DIR, file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) return resolve(true);
    const req = https.get(BASE + file, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return resolve(false);
      }
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on('finish', () => out.close(() => resolve(true)));
      out.on('error', () => resolve(false));
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
  });
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

const files = [...new Set(rows.map((r) => r[3]))];
const results = await pool(files, 10, async (f) => [f, await download(f)]);
const ok = Object.fromEntries(results);

const depts = [];
for (const [dept, name, role, file] of rows) {
  let d = depts.find((x) => x.title === dept);
  if (!d) { d = { title: dept, people: [] }; depts.push(d); }
  d.people.push({ name, role, image: ok[file] ? `/staff/${file}` : '' });
}

const ts =
  `// AUTO-GENERATED by scripts/fetch-staff.mjs from the live Mit-Mak staff\n` +
  `// directory (portal.mitmakmotors.online/staff). Re-run the script to refresh.\n\n` +
  `export interface StaffPerson {\n  name: string;\n  role: string;\n  image: string;\n}\n\n` +
  `export interface StaffDepartment {\n  title: string;\n  people: StaffPerson[];\n}\n\n` +
  `export const staffDepartments: StaffDepartment[] = ${JSON.stringify(depts, null, 2)};\n\n` +
  `export const staffCount = ${rows.length};\n`;
fs.writeFileSync('data/staff.ts', ts);

const failed = files.filter((f) => !ok[f]);
console.log(`people=${rows.length} departments=${depts.length} images_ok=${files.length - failed.length}/${files.length}`);
if (failed.length) console.log('FAILED:', failed.join(', '));
