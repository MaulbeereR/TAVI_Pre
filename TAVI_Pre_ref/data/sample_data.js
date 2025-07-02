// TAVI病例数据
const taviCases = [
    {
        id: 1,
        doi: "10.1016/j.jccase.2017.08.003",
        pmid: "30279838",
        title: "Transcatheter aortic valve implantation in a patient with aplastic anemia.",
        source: "J Cardiol Cases",
        author: "Yujiro Kawai, Yasuyuki Toyoda, Hikaru Kimura, Miki Horigome, Yasutoshi Tsuda, Takahiro Takemura",
        abstract: "Aplastic anemia is a syndrome involving pancytopenia caused by bone marrow insufficiency. Pancytopenia increases the surgical risk of bleeding and infection. Here, we report a successful. transcatheter aortic valve implantation (TAVI) in a patient with aplastic anemia. The patient was a 76- year-old woman who was admitted to our hospital with syncope. Laboratory testing showed. pancytopenia, and echocardiography revealed severe aortic valve stenosis. Although the log.EuroscORE and STs Score were not overly high, because of the presence of pancytopenia, surgical aortic valve. replacement was considered too high risk, making her a candidate for TAvI. In this case, the patient's pancytopenia was so severe that even TAVI without preparation was considered high risk. In light of this,. we carried out a two-day preoperative administration of granulocyte colony-stimulating factor and transfused packed red blood cells and platelet concentrates. TAVI was performed via the left femoral artery using the cut-down procedure under general anesthesia. The postoperative course was uneventful,. and she was discharged on the sixth postoperative day. With adequate preoperative preparation, TAVI may be performed safely in high-risk patients with hematologic disorders.",
        year: 2017,
        Basic_Info: {
            Age: "76",
            Gender: "Female",
            Case: "Severe aortic valve stenosis with severe aplastic anemia",
            Previous_History: "Severe pancytopenia"
        },
        Pre_Info: {
            Mean_Gradient: "44 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "0.80 cm²",
            Maximum_Velocity: "4.28 m/s",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "23 mm",
            Valve_Type: "ACURATE Neo"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.08.003.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.003/images/04f1957974dfc35dd6d9cbcf1c41e25285fda908b1a950c56c92ffe3d645cb9e.jpg",
                    caption: "Perioperative clinical course."
                },
            ]
        },
    },
    {
        id: 2,
        doi: "10.1016/j.jccase.2017.08.016",
        pmid: "30279848",
        title: "Transcatheter bicuspid aortic valve replacement in Turner syndrome: A unique experience of interventional cardiologist",
        source: "J Cardiol Cases.",
        author: "Ahmad Munir, Ahsan Wahab, Mahin Khan, Hafiz Khan, Wah Wah Htun, Theodore L Schreiber",
        abstract: "A 69-year-old short-statured Turner syndrome (TS) patient with a history of poliomyelitis in childhood and moderate bicuspid aortic stenosis (BAS) reported worsening dyspnea and fatigue over six months. A repeat transthoracic echocardiogram revealed progression to severe aortic stenosis with dilated ascending aorta (AA). As part of the work-up for aortic valve replacement, the patient underwent cardiac catheterization, which revealed a severely calcified AV with an area of 0.5 sq. cm and a mean gradient of 37 mmHg. On coronary angiography, there was 70% stenosis of the proximal left anterior descending artery (LAD). Due to poor rehabilitation potential, she was deemed high-risk for surgical aortic valve replacement. A recommendation for transcatheter aortic valve replacement (TAVR) with stenting of the proximal LAD was made. Dilated AA was managed conservatively with serial noninvasive imaging. The patient underwent TAVR with Edwards-Sapien valve (23 mm S3) and stenting of proximal LAD. The procedure was successful without complications. To our knowledge, our patient is the first case of TAVR in BAS with aortopathy in TS. <Learning objective: Therapeutically, transcatheter aortic valve replacement is an off-label indication for bicuspid aortic stenosis. In real-life practice, many of these patients are poor surgical candidates and demand careful and judicious decision-making in the presence of diverse clinical scenarios. In such circumstances, a multidisciplinary approach with shared decision-making is required to recommend best possible therapeutic solution in the presence of limited data.>. Keywords: Aortic valve stenosis; Aortopathy; Bicuspid aortic valve stenosis; Transcatheter aortic valve replacement; Turner syndrome.",
        year: 2017,
        Basic_Info: {
            Age: "69",
            Gender: "Female",
            Case: "Moderate bicuspid aortic stenosis with severe aortic stenosis and dilated ascending aorta",
            Previous_History: "Hypertension, diabetes mellitus, obstructive sleep apnea, hyperlipidemia, poliomyelitis in childhood, hip arthritis"
        },
        Pre_Info: {
            Mean_Gradient: "39 mmHg",
            Peak_Gradients: "39 mmHg",
            Valve_Area: "0.5 cm²",
            Maximum_Velocity: "4.1 m/s",
            Ejection_Fraction: "60%"
        },
        Procedure: {
            Valve_Diameter: "23 mm",
            Valve_Type: "Avalus"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "14.6 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
            },
            Files: {
                PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.08.016.pdf",
                Images: [
                    {
                        path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/8132b96912747324e80d47e5093f9ca76e8f0e49403f8a5defe15f77c04774e5.jpg",
                        caption: "Computed tomography angiogram displaying double-oblique projections along the aortic root axis from multiplanar reconstruction showing: (A) calcification on the bicuspid aortic valve along with dilated ascending aorta; (B) elucidation of the angle between ascending aorta and the plane of the bicuspid aortic valve."
                    },
                    {
                        path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/c310fe760bb94125a0fe6b9788226e72bed10f50f6245166b496885cbe39acac.jpg",
                        caption: "(A) Computed tomography angiogram displaying a double-oblique projection of the aorta from multiplanar reconstruction showing dilated ascending aorta, 90 angle in the arch at the junction of the transverse and descending aorta (arrow) and tortuosity in the descending thoracic aorta. (B) 3D reformatted angiogram of the aorta showing the above abnormalities."
                    },
                    {
                        path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/d7e1dce80b9ef308d093042a0a6a97e61f49162a95fe6229ecfec6dd7ffd9122.jpg",
                        caption: "Cine angiogram during positioning and deployment of the Edwards Sapien S3 valve. (A) Alignment and positioning of the valve using the advantage of the flexible sheath. (B) Deployment of the valve and annular fixation by balloon inflation. (C) Post valve-deployment image."
                    },
                    {
                        path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/ff9f08cf5073d611d0c7ec06084c4a41416b0d98441f6d2221d99d497d62809c.jpg",
                        caption: "Computed tomography angiogram displaying double-oblique projection along the bicuspid aortic valve annular plane from multiplanar reconstruction showing asymmetric calcification of the aortic leaflets."
                    }
                ]
            },
    },
    {
        id: 3,
        doi: "10.1016/j.jccase.2017.11.003",
        pmid: "30279868",
        title: "A case of acute coronary syndrome caused by delayed coronary ischemia after transcatheter aortic valve implantation",
        source: "J Cardiol Cases. ",
        author: "Yuichi Ninomiya, Shuichi Hamasaki, Yutaro Nomoto, Takeko Kawabata, Daichi Fukumoto, Akino Yoshimura, Shunichi Imamura, Masakazu Ogawa, Yuta Shiramomo, Keisuke Kawaida, Goichi Yotsumoto, Hiroto Suzuyama, Kazuhiro Nishigami, Tomohiro Sakamoto, Mitsuru Ohishi",
        abstract:"An 84-year-old female patient suffered from dyspnea due to severe aortic stenosis. Several comorbidities and her advanced age made her acceptable for transcatheter aortic valve implantation (TAVI). The TAVI procedure was performed via a femoral access and a 26-mm CoreValve prosthesis (Medtronic, Minneapolis, MN, USA) was implanted. The prosthesis was deployed at a high position because of short. distance between the annulus base and coronary arteries. Aortic angiography indicated normal contrast flow into both coronary arteries. ",
        year: 2017,
        Basic_Info: {
            Age: "84",
            Gender: "Female",
            Case: "Severe aortic stenosis with acute coronary syndrome caused by delayed coronary ischemia after TAVI.",
            Previous_History: "Several comorbidities"
        },
        Pre_Info: {
            Mean_Gradient: "N/A",
            Peak_Gradients: "77 mmHg",
            Valve_Area: "0.44 cm²",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "26 mm",
            Valve_Type: "CoreValve"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.11.003.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.11.003/images/a6c2dabb70d1bca031aad3527bde50e20357abb418b517a33e63a6ab249c5004.jpg",
                    caption: "The intraoperative findings. The sealing skirt of CoreValve was stuck to the aortic wall except for the commissure between the non-coronary cusp and the left coronary cusp. There was a reduction in blood flow from the aorta to the sinus of Valsalva because of the small gap (blue circle)."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.11.003/images/b02626a3ec8eed219a2302f92527fd3713095dc0242d65428b780898acca2ef4.jpg",
                    caption: "The first coronary angiographic finding. The 26-mm CoreValve prosthesis was deployed at a high position, at a depth of -2 mm. Aortic angiography indicated normal contrast flow into both coronary arteries."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.11.003/images/f006eb1350ae2fbbe4fed4abee9b2370c74c314c7ebd676b7e6cdec8b4be6b88.jpg",
                    caption: "(Left) The schema of the intraoperative finding. (Right) The second coronary angiographic finding. The blood flow perfused not directly to the right coronary cusp, but by a roundabout route from the left coronary cusp because of the adhesion between the transition zone (sealing skirt) of CoreValve and the aorta around the non-coronary cusp."
                },
            ]
        },
    },
    {
        id: 4,
        doi: "10.1016/j.jccase.2017.12.001",
        pmid: "30279872",
        title: "Simultaneous transcatheter aortic valve implantation and endovascular aneurysm repair in a patient with very severe aortic stenosis with abdominal aortic aneurysm",
        source: "J Cardiol Cases. ",
        author: "Yu Sato, Yu Horiuchi, Kazuyuki Yahagi, Taishi Okuno, Takayoshi Kusuhara, Motoi Yokozuka, Sumio Miura, Takeshi Taketani, Kengo Tanabe",
        abstract: "The safety of non-cardiac surgery is uncertain for asymptomatic patients with very severe aortic stenosis. (AS). Herein, we describe a case involving an elderly and frail patient with asymptomatic, very severe AS. The patient was considered a high-risk candidate for aortic valve replacement (AVR); thus, transcatheter aortic valve implantation (TAvI) was planned. On perioperative examination, an abdominal aortic aneurysm (AAA) was observed, which required endovascular aneurysm repair (EVAR). To reduce the risks involved with sequential procedures, TAVI and EVAR were performed simultaneously. In patients with severe AS who are high-risk candidates for AVR, TAVI can be considered as an alternative therapy before non-cardiac surgery. In addition, the combined TAVI and EVAR procedure can reduce the risks associated with the perioperative period. ",
        year: 2017,
        Basic_Info: {
            Age: "83",
            Gender: "Male",
            Case: "Very severe aortic stenosis with abdominal aortic aneurysm",
            Previous_History: "Pancytopenia due to myelodysplastic syndrome"
        },
        Pre_Info: {
            Mean_Gradient: "105 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "6.3 m/s",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "26 mm",
            Valve_Type: "Edwards"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.12.001.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.12.001/images/fbf5e123e097a6bccd5ece99ec783695a0ddbbf6bca868613ec30b466a6fd784.jpg",
                    caption: "A cross-sectional computed tomography image showing an abdominal aortic aneurysm (AAA) with a diameter of 57 mm. AAA ranged from just beneath the branch of the renal artery to the proximal part of the common iliac artery on both sides."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.12.001/images/41e0f21fc75a773f98d5393fbc102e65bb26ed068ae7989bfab615763164f083.jpg",
                    caption: "Valve implantation. A 26 mm CoreValve was placed in the appropriate location."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.12.001/images/11cebbc140d23da6c56e9a3bdc3992b27f5d70ba94bd23aa73cb7bcb1c362086.jpg",
                    caption: "Angiograms of the abdominal aortic aneurysm pre- and post-endovascular aneurysm repair. An excellent final angiographic image, which did not exhibit endoleak, was obtained."
                },
            ]
        },
    },
    {
        id: 5,
        doi: "10.1016/j.jccase.2018.01.002",
        pmid: "30279882",
        title: "Transcatheter aortic valve implantation in a patient with severe aortic valve stenosis, colon cancer, and obstructive ileus: A case report",
        source: "J Cardiol Cases. ",
        author: "Tetsu Tanaka, Kazuyuki Yahagi, Taishi Okuno, Yu Horiuchi, Takayoshi Kusuhara, Motoi Yokozuka, Sumio Miura, Kengo Tanabe",
        abstract: "An 85-year-old woman with symptomatic severe aortic stenosis (As) developed an obstructive ileus caused by colon cancer. Colectomy was considered a high-risk surgery due to both the severe AS and obstructive ileus. Therefore, we planned placement of a colonic stent for the obstructive ileus. After stenting, we performed transcatheter aortic valve implantation (TAvi) instead of surgical aortic valve. replacement (SAvR), because of the risk of bleeding during extracorporeal circulation and the. perioperative risk of AVR (Society of Thoracic Surgery predicted risk of mortality: 7.4%). Successful colonic stenting and TAVI allowed a safer colectomy. The period from TAVI to colectomy was 12 days. TAVI could be useful for symptomatic severe AS in high-risk patients prior to non-cardiac surgery, especially for malignant tumors. ",
        year: 2018,
        Basic_Info: {
            Age: "85",
            Gender: "Female",
            Case: "Severe aortic stenosis, colon cancer, and obstructive ileus",
            Previous_History: "N/A"
        },
        Pre_Info: {
            Mean_Gradient: "52 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "0.5 cm²",
            Maximum_Velocity: "4.5 m/s",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "23 mm",
            Valve_Type: "Edwards SAPIEN"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "11 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.01.002.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.002/images/ca30ab5790ecd9ee95552e4b4b7be905a6064a5dd5103dd3f3db6abf77222605.jpg",
                    caption: "(A) Colonoscopy showing advanced colon cancer (yellow arrowhead) and obstruction. (B) Contrast-enhanced computed tomography demonstrating colon cancer (red arrowhead) and obstructive ileus. (C) Colonic stenting resolved the obstruction caused by advanced colon cancer."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.002/images/31ab825752a1e3b7444c7ef3b85e598d9efa342dc7057e7a3aefef6101086d6c.jpg",
                    caption: "Fluoroscopy during transcatheter aortic valve implantation. (A) Implantation of 23-mm Sapien XT valve. (B) Aortography after valve deployment."
                },
            ]
        },
    },
    {
        id: 6,
        doi: "10.1016/j.jccase.2018.01.010",
        pmid: "30279890",
        title: "Left ventricular reverse remodeling after transcatheter aortic valve implantation complicated by paroxysmal complete atrioventricular block",
        source: "J Cardiol Cases. ",
        author: "Luca Segreti, Kristian Ujka, Tea Cellamaro, Giulio Zucchelli, Andrea Di Cori, Ezio Soldati, Maria Grazia Bongiorni",
        abstract: "An 86-year-old man with unremarkable clinical history complaining of asthenia and dyspnea was. diagnosed with low-flow low-gradient aortic stenosis [LFLG-AS; left ventricular ejection fraction (LVEF) 40% and transaortic mean gradient 37 mmHg, increasing to 52% and 55 mmHg after dobutamine infusion]. The patient underwent transcatheter aortic valve implantation (TAVI; Edwards CENTERATM 29, Irvine, CA, USA). The procedure and the following hospital stay were free from complications, with no. changes on electrocardiography (ECG). ",
        year: 2018,
        Basic_Info: {
            Age: "86",
            Gender: "Male",
            Case: "Low-flow low-gradient aortic stenosis",
            Previous_History: "Unremarkable clinical history"
        },
        Pre_Info: {
            Mean_Gradient: "37 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "4.7 m/s",
            Ejection_Fraction: "40%"
        },
        Procedure: {
            Valve_Diameter: "N/A",
            Valve_Type: "Evolut"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.01.010.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.010/images/4953a1215caa47f597f1729ec178ea9d6d06883c142cff621c720d2e3a8c4c0f.jpg",
                    caption: "(A) Echocardiographic examination before transcatheter aortic valve implantation (TAVI). Above: Time-velocity graph at Doppler echocardiography denoting severe aortic stenosis. Below: The left ventricular outflow tract (LVOT) in parasternal long-axis view. (B) Control echocardiographic examination 6 months after TAVI. Above: a normal profile of the time-velocity curve is registered. Below: The LVOT diameter is reduced compared to baseline (from 2.2 cm to 1.6 cm)."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.010/images/9afd74883eb7fa62f99905dac9e35ca687c99ab562993448942e704bdd03325d.jpg",
                    caption: "Baseline electrocardiographic recording (sinus rhythm, PR interval 200 ms, non-specific repolarization abnormalities)."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.010/images/eaba4553763b0894ccaad9893f08f18497dfaaf9c92054a2922250c0eaa657ce.jpg",
                    caption: " Implantable loop recorder registration during syncope, demonstrating paroxysmal complete atrioventricular block and wide QRS escape rhythm. Arrows indicate evident P waves."
                },
            ]
        },
    },
    {
        id: 7,
        doi: "10.1016/j.jccase.2018.02.004",
        pmid: "30279894",
        title: "Transcatheter aortic valve implantation for severe aortic stenosis in dextrocardia with situs inversus using a self-expanding aortic valve",
        source: "J Cardiol Cases.",
        author: "Yuichi Morita, Tomokazu Okimoto, Yasutsugu Nagamoto, Shingo Mochizuki, Kazunori Yamada",
        abstract: "Transcatheter aortic valve implantation (TAVI) has evolved into a standard therapy for aged patients with severe aortic valve stenosis who are not candidates for surgery. However, the reports about the safety of TAVI for patients with dextrocardia situs inversus are few. An 84-year-old man with dextrocardia situs inversus underwent a TAVI for severe aortic stenosis (AS) with an aortic valve area of 0.5 cm?, and a mean pressure gradient of 46 mmHg. Preoperative computed tomography (CT) revealed an inverted (rightward) orientation of the ventricle apex as well as the great vessels. The TAVI was performed through a transfemoral approach under general anesthesia. A left and right reversed fluoroscopic image was used for the TAVI. Finally, a 26-mm CoreValve Evolut R (Medtronic, Minneapolis, MN, USA) was successfully deployed at the aortic annulus under angiographic guidance. Post-procedural transthoracic echocardiography demonstrated a well-functioning CoreValve Evolut R with a mean pressure gradient of 8 mmHg. No complications occurred during the procedure or peri-procedural period. The patient's symptoms subsequently improved from New York Heart Association class IlI to class I. In conclusion, a TAVI procedure was safely performed in a patient with dextrocardia situs inversus through a transfemoral approach by evaluating the anatomical details with preoperative CT. ",
        year: 2018,
        Basic_Info: {
            Age: "84",
            Gender: "Male",
            Case: "Severe aortic stenosis with dextrocardia situs inversus",
            Previous_History: "Hypertension, dyslipidemia"
        },
        Pre_Info: {
            Mean_Gradient: "46 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "0.5 cm²",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "72%"
        },
        Procedure: {
            Valve_Diameter: "26 mm",
            Valve_Type: "Hancock"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "8 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.02.004.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.02.004/images/a1c798ac51081c67b84507d60d7c0c06a1d119cc197cdf4f8d947fb9a0a39160.jpg",
                    caption: "Computed tomography (CT) showing an inverted (rightward) orientation of the ventricle apex and great vessels. (A) CT at the level of the aortic arch. (B) CT at the level of the heart. (C) CT showing a longitudinal sectional view of the aortic annulus. The aortic root angulation was 50."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.02.004/images/ece5353685704025c6862a4ee6752e9070e55768991aa15ec63d3a96cb4884af.jpg",
                    caption: "Normal and reversed fluoroscopic images. (A) A normal image. (B) A left and right reversed image."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.02.004/images/902615d7cc0746fb34e19ad5e61be2712692b46e5fcfdf5aef93134c703b0066.jpg",
                    caption: "A fluoroscopic image showing a 26-mm CoreValve Evolut R deployed at the aortic annulus."
                },
            ]
        },
    },
    {
        id: 8,
        doi: "10.1016/j.jccase.2018.06.007",
        pmid: "30279933",
        title: "Trans-catheter aortic valve implantation without contrast using the Lotus mechanically-expanded heart valve",
        source: "J Cardiol Cases.",
        author: "Noman Ali, Smriti Saraf, Dominik Schlosshan, Michael Cunnington, Christopher J Malkin, Daniel J Blackman",
        abstract: "Trans-catheter aortic valve implantation (TAvI) has become an established treatment for inoperable and high-surgical risk patients with severe, symptomatic aortic stenosis (As). Post-procedural acute kidney injury (AKI) is a frequent complication following TAVI and is associated with increased mortality. Patients with pre-existing chronic renal impairment are at particularly high risk. The etiology of post-TAVI AKI is multi-factorial, but the principal procedural issues are contrast-induced nephropathy, and renal hypoperfusion secondary to intra-procedural hypotension. We report a case of a TAVI in an 80-year-old patient with severe AS and significant chronic kidney disease (CKD), which was carried out without the. use of contrast and with minimal procedural hypotension. ",
        year: 2018,
        Basic_Info: {
            Age: "80",
            Gender: "Male",
            Case: "Severe symptomatic aortic stenosis with significant chronic kidney disease",
            Previous_History: "Chronic kidney disease with a creatinine level of 4.6 mg/dL and eGFR of 12 mL/min/1.73m²"
        },
        Pre_Info: {
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "27 mm",
            Valve_Type: "INSPIRIS"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.06.007.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.06.007/images/a5cac0f78f404d51a6aedbfbf671638db0159ef73ba34b88530734891d6a5bda.jpg",
                    caption: "3D transesophageal echocardiography was used in order to measure annulus size and guide the selection of an appropriately sized valve prosthesis. Multi-planar reformatting was used in order to generate coronal, axial, and sagittal views as shown."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.06.007/images/21097300148c82288465c17df595b8410b6ad2bab6dc8e4c64117c9395857973.jpg",
                    caption: "(A) A pigtail catheter, positioned in the non-coronary sinus without use of contrast, as well as the heavy calcification of the aortic valve was used to aid in the positioning of the Lotus valve. (B) The Lotus valve in situ following deployment."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.06.007/images/870781d752202b0187c55bb3122515c0224099b94280f9a2bd0c2a6110748d2f.jpg",
                    caption: "Intra-procedural transesophageal echocardiography images demonstrating only trivial paravalvular regurgitation following deployment of the TAVI prosthesis. LA, left atrium; RA, right atrium; RV, right ventricle; IAS, inter-atrial septum; NCS, non-coronary sinus; LCS, left coronary sinus; RCS, right coronary sinus; LVOT, left ventricular outflow tract; AMVL, anterior mitral valve leaflet; TAVI, trans-catheter aortic valve implantation."
                },
            ]
        },
    },
    {
        id: 9,
        doi: "10.1016/j.jccase.2018.07.005",
        pmid: "30416618",
        title: "Critical exacerbation of idiopathic pulmonary fibrosis after transcatheter aortic valve implantation: Need for multidisciplinary care beyond heart team",
        source: "J Cardiol Caes.",
        author: "Yoichiro Sugizaki, Shumpei Mori, Yuichi Nagamatsu, Tomomi Akita, Akira Nagasawa, Takayoshi Toba, Masatsugu Yamamoto, Tatsuya Nishii, Norihiko Obata, Yoshikatsu Nomura, Hiromasa Otake, Toshiro Shinke, Yutaka Okita, Ken-Ichi Hirata",
        abstract: "An 82-year-old man with severe aortic stenosis and idiopathic pulmonary fibrosis (IPF) underwent transcatheter aortic valve implantation (TAVI) under general anesthesia. However, following a successful. TAVI procedure, he developed progressive respiratory failure because of the exacerbation of IPF. Despite the use of immunosuppressants, the patient could not be saved and he died of respiratory failure.. Although TAVI is a less invasive procedure compared to conventional surgical aortic valve replacement, it. is currently selected for management of severely ill, frail, and elderly patients. This case highlights the potential risk of IPF exacerbation following a TAVI procedure performed under general anesthesia.. ",
        year: 2018,
        Basic_Info: {
            Age: "82",
            Gender: "Male",
            Case: "Severe aortic stenosis with dyspnea on exertion and idiopathic pulmonary fibrosis (IPF)",
            Previous_History: "Coronary artery bypass grafting, diagnosed with IPF"
        },
        Pre_Info: {
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "60%"
        },
        Procedure: {
            Valve_Diameter: "29 mm",
            Valve_Type: "Inoue"
        },
        Result: {
            Death: true,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.07.005.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/d33be38ee097a63fed77ae9fed3bbcd8be2cdd6b8fd8031dcf7b3cbd9770360b.jpg",
                    caption: "Chest thin-slice computed tomography before transcatheter aortic valve implantation. Chest thin-slice computed tomography confirmed reticulation and honeycombing in the bilateral dorsal and lower lung fields, which was consistent with usual interstitial pneumonia pattern of baseline idiopathic pulmonary fibrosis."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/b57d413734ffb549def742101933abdd0380a282fb4bd3fbcee3f542e8c349f4.jpg",
                    caption: "Chest radiography and thin-slice computed tomography evaluation findings with laboratory data and echocardiographic findings. Ground-glass opacities in the bilateral lungs with elevated tricuspid regurgitation pressure gradient (TRPG) and E-wave velocity were detected on postoperative day (POD) 14. Following treatment of congestive heart failure, computed tomography (CT) showed improvement in ground-glass opacities with residual reticulation on POD 60, along with a temporal decrease in brain natriuretic peptide (BNP) level and improvement in echocardiographic findings. "
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/8f4651055836635a6c8c9435eadda8c4d8e5377d40eedd082246d1241fbccbfb.jpg",
                    caption: "On POD 70, development of new diffuse ground-glass opacities was seen in the bilateral lung fields without evidence of left heart failure, which was diagnosed as an exacerbation of idiopathic pulmonary fibrosis. Re-elevation of BNP level and TRPG on POD 70 were consistent with right ventricular overload and pulmonary hypertension due to exacerbation of idiopathic pulmonary fibrosis. Note consistent and progressive increase in Krebs von den lungen-6 (KL-6)."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/dc72b4d34dc8eb7254f5d31b545eb0ab6e4ca4f9f8ca6ebcdaaef34386d5dbe6.jpg",
                    caption: "Laboratory data before transcatheter aortic valve implantation (TAVI) and at readmission."
                },
            ]
        },
    },
    {
        id: 10,
        doi: "10.1016/j.jccase.2018.09.007",
        pmid: "32042352",
        title: "Successful transcatheter aortic valve implantation in a Jehovah's Witness patient with a small aortic root and severe leaflet calcification",
        source: "J Cardiol Cases.",
        author: "Toru Yoshizaki, Toru Naganuma, Sunao Nakamura",
        abstract: "A 69-year-old female Jehovah's Witness was diagnosed with symptomatic severe aortic stenosis (AS). Because the patient, who refused blood transfusion for religious reasons, had multiple comorbidities, such as thrombocytopenia due to liver cirrhosis, esophageal varices, and an old cerebral infarction, a decision to perform transcatheter aortic valve implantation (TAvI) was made. Preprocedural computed tomography showed a small aortic root and severe leaflet calcification, especially at the non-coronary cusp; therefore, the risk of annulus and Valsalva rupture was considered to be high. A 20-mm transcatheter heart valve (Edwards SAPIEN3; Edwards Lifesciences Corporation, Irvine, CA, USA) was. successfully implanted using the transfemoral approach. To prevent blood transfusion, erythropoietin and sodium ferrous citrate were prescribed during the periprocedural period. The postprocedural course was uneventful, and the patient was discharged on postoperative day 10. TAVI, which is associated with a significantly lower need for transfusion compared with surgical aortic valve replacement, has recently been performed as a less invasive treatment for high- or intermediate-risk patients with As. This case highlights the feasibility and safety of TAVI using a 20-mm transcatheter heart valve for a patient with severe AS, a small aortic root, and severe and eccentric leaflet calcification who refused blood transfusion.. <Learning objective: Transcatheter aortic valve implantation is a less invasive procedure and is possibly the optimal treatment for patients with severe aortic stenosis who refuse blood transfusion. In addition, periprocedural approaches that promote a high preprocedural hemoglobin level as well as prevent unnecessary blood loss and catastrophic complications are important in avoiding blood transfusions.> 2019 Published bv Elsevier Ltd on behalf of Iapanese College of Cardiologv. ",
        year: 2018,
        Basic_Info: {
            Age: "69",
            Gender: "Female",
            Case: "Severe aortic stenosis with multiple comorbidities including liver cirrhosis, thrombocytopenia, esophageal varices, diabetes mellitus, and an old cerebral infarction.",
            Previous_History: "Liver cirrhosis, thrombocytopenia, esophageal varices, diabetes mellitus, old cerebral infarction, refused blood transfusion due to being a Jehovah's Witness."
        },
        Pre_Info: {
            Mean_Gradient: "79 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "0.51 cm²",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "61%"
        },
        Procedure: {
            Valve_Diameter: "20 mm",
            Valve_Type: "Inovare"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.09.007.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.09.007/images/6d2e3360d2c4dcfbfc65618681f4c69cfead47dd2bae71a11101e18e7d778e73.jpg",
                    caption: "(A) Preprocedural computed tomography showing heavily calcified leaflets, especially at the non-coronary cusp. RCC, right coronary cusp; LCC, left coronary cusp; NCC non-coronary cusp. (B) Preprocedural computed tomography showing the left coronary height from the annulus. (C) Serial hemoglobin measurements during the periprocedural period. EVL, endoscopic variceal ligation; Hb, hemoglobin; TAVI, transcatheter aortic valve implantation. (D) Intraprocedural angiography of a 20-mm SAPIEN3 prosthesis implantation with protection for the left main coronary artery using a guiding catheter. The balloon indentation shows severe calcification (dashed circle). (E) Intraprocedural transesophageal echocardiogram showing the transcatheter heart valve (solid arrow) positioned at the edge of the annulus opposite the heavily calcified leaflet at the non-coronary cusp (dashed arrow). (F) Transesophageal echocardiogram showing mild paravalvular leak (solid arrow) from the gap between the transcatheter heart valve and heavily calcified leaflets. (G) The crossover balloon technique for performing percutaneous closure to reduce bleeding from the access site. During inflation of an 8.0 40-mm balloon to low pressure in the external iliac artery, the main introducer sheath was withdrawn and the access site was secured with a percutaneous closure system. (H) Final femoral angiogram shows the injection of contrast material from the tip of the over-the-wire balloon and that hemostasis at the access site was achieved. (I) The postprocedural computed tomography showing the transcatheter heart valve (solid arrow) seated opposite the heavily calcified leaflet at the non-coronary cusp (dashed arrow)."
                },
            ]
        },
    },
    {
        id: 11,
        doi: "10.1016/j.jccase.2018.12.001",
        pmid: "30949246",
        title: "Use of the MANTA device to rescue failed pre-closure following transfemoral transcatheter aortic valve implantation",
        source: "J Cardiol Cases.",
        author: "Noman Ali, Daniel J Blackman, Michael Cunnington, Christopher J Malkin",
        abstract: "Access site vascular complications remain relatively frequent following trans-femoral (TF) transcatheter aortic valve implantation (TAvl), and are associated with significant morbidity as well as increased mortality. Suture-based vascular closure devices (VcD) are widely used and have been demonstrated to reduce the rate of vascular complications. However, failure to achieve adequate hemostasis following their use occurs in some cases, and may necessitate surgical escalation. ",
        year: 2018,
        Basic_Info: {
            Age: "79",
            Gender: "Male",
            Case: "Congestive cardiac failure and exertional angina due to severe degenerative disease of a Mitroflow prosthesis.",
            Previous_History: "Coronary artery bypass grafting (CABG) and aortic valve replacement (AVR) with a 21mm Mitroflow."
        },
        Pre_Info: {
            Mean_Gradient: "40 mmHg",
            Peak_Gradients: "87 mmHg",
            Valve_Area: "0.58 cm²",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "23 mm",
            Valve_Type: "Vitaflow Liberty"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "30 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.12.001.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.001/images/ec40128f3299d5517a6bbf9fa074267c8fe6e339cf3003e5f7e67a90e463a3d0.jpg",
                    caption: "Pre-transcatheter aortic valve implantation computed tomography (CT) images. (A) 3D reconstructed image demonstrating significant tortuosity and aneurysmal segments within the ileo-femoral vessels. (B) An axial cross-sectional image, used to determine the optimal site of access for the left femoral artery. (C and D) 3D reconstructed images demonstrating the extent of calcification within both ileo-femoral arteries."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.001/images/7f126128c44fe7c9a0866c13c84b4cc6720d41648ea87797a2aafa90acc7b542.jpg",
                    caption: "The MANTA device. (1–6) Schematic representation of the steps involved in the deployment of the MANTA. In the present case, steps 1 and 2 were omitted since the device was used as a rescue rather than electively. Images provided by Essential Medical Inc., Malvern, PA, USA."
                },
            ]
        },
    },
    {
        id: 12,
        doi: "10.1016/j.jccase.2018.12.011",
        pmid: "30996760",
        title: "Transcatheter aortic valve replacement in a patient with anomalous origin of the left coronary artery",
        source: "J Cardiol Cases.",
        author: "Sung Woo Cho, Byung Gyu Kim, Taek Kyu Park, Seung-Hyuk Choi, Hyeon-Cheol Gwon, Sung-Ji Park, Jong Chun Nah",
        abstract: "Transcatheter aortic valve replacement (TAvR) is widely performed in patients with severe aortic stenosis (As), having a high surgical risk. However, reports of TAVR performed in patients with anomalous coronary arteries are rare. In existing literature, several complications including coronary obstruction are reported. In this study, we report a 77-year-old female patient with severe AS and anomalous origin of the left coronary artery from the right coronary sinus, who successfully underwent TAVR. ",
        year: 2018,
        Basic_Info: {
            Age: "77",
            Gender: "Female",
            Case: "Severe aortic stenosis with anomalous origin of the left coronary artery from the right coronary sinus",
            Previous_History: "Hypertension and dyslipidemia"
        },
        Pre_Info: {
            Mean_Gradient: "85.2 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "0.46 cm²",
            Maximum_Velocity: "6.28 m/s",
            Ejection_Fraction: "69.3%"
        },
        Procedure: {
            Valve_Diameter: "26 mm",
            Valve_Type: "JenaValve"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "9.57 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "2.23 m/s"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.12.011.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.011/images/7c0054db1364680acf5f0ad913c8910995b8a14db8f5838e50a9e607b5dee4a2.jpg",
                    caption: "(A) Transthoracic echocardiography showing a continuous wave Doppler image of severe aortic stenosis obtained from apical 5-chamber view before transcatheter aortic valve replacement. Coronary angiography showing a (B) right coronary artery (arrow head) and distal left coronary artery from conus branch (arrow). (C) Proximal left coronary artery from the right coronary sinus and severe calcified aortic valve (arrow head). Coronary aorta computed tomography angiography showing a (D) bifurcation and anomalous origin of the left coronary artery at the right coronary sinus (yellow arrow). (E and F) Proximal left coronary artery via retroaortic course adjacent to the sinotubular junction (yellow arrow) (G) Schematic diagram of relationship between coronary arteries and valves."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.011/images/9175ead190892f104788c395df034cc49fbbb4a65d7b730cf014964e97b7bca6.jpg",
                    caption: "Coronary aorta computed tomography angiography showing the size of (A) sinus of Valsalva and (B) sinotubular junction, (C) the aortic annular area and the annulus area-driven and perimeter-driven diameters, and (D) the distance of the right coronary ostia from aortic annulus plane. Aortography during the procedure, (E) before TAVR. (F) after TAVR. (G) Transthoracic echocardiography showing a continuous wave Doppler image of aortic valve obtained from apical 5- chamber view after TAVR."
                },
            ]
        },
        Abstract: "Transcatheter aortic valve replacement (TAvR) is widely performed in patients with severe aortic stenosis (As), having a high surgical risk. However, reports of TAVR performed in patients with anomalous coronary arteries are rare. In existing literature, several complications including coronary obstruction are reported. In this study, we report a 77-year-old female patient with severe AS and anomalous origin of the left coronary artery from the right coronary sinus, who successfully underwent TAVR. ",
    },
    {
        id: 13,
        doi: "10.1016/j.jccase.2018.12.016",
        pmid: "30996761",
        title: "Unexpected massive pleural effusion leading to discovery of left subclavian artery rupture during transcatheter aortic valve implantation",
        source: "J Cardiol Cases.",
        author: "Hideyuki Kawashima, Yusuke Watanabe, Akihisa Kataoka, Ken Kozuma",
        abstract: "An 89-year-old woman underwent transcatheter aortic valve implantation (TAVI) for severe aortic valve stenosis, based on a logistic European System for Cardiac Operative Risk Evaluation of 59.6% and Society of Thoracic Surgeons risk score of 17.1%. The patient had multiple comorbidities including chronic kidney disease with creatinine clearance of 15ml/min. We ruled out preprocedural contrast-enhanced computed tomography and coronary angiography to prevent exacerbation of renal dysfunction. Moreover, we concluded that a trans-subclavian approach was optimal, because the transfemoral approach was contraindicated due to severe lordosis, and the transapical approach was contraindicated due to severe chronic obstructive pulmonary disease and frailty. This report describes a massive pleural effusion that led to the discovery of subclavian artery rupture causing hemodynamic shock. Hemodynamic instability in this patient was caused by hypovolemic and obstructive shock, with a pleural perfusion caused by subclavian artery rupture. Monitoring via transesophageal echocardiography during the procedure enabled early discovery of the massive pleural effusion. Subsequent covered stent implantation stabilized the subclavian artery rupture, and the patient became hemodynamically stable. As subclavian artery rupture can occur during trans-subclavian TAVI, the presence of calcifications and tortuosity requires careful management. ",
        year: 2018,
        Basic_Info: {
            Age: "89",
            Gender: "Female",
            Case: "Severe aortic valve stenosis with medically uncontrollable congestive heart failure.",
            Previous_History: "Chronic kidney disease with creatinine clearance of 15 ml/min, chronic obstructive pulmonary disease."
        },
        Pre_Info: {
            Mean_Gradient: "32 mmHg",
            Peak_Gradients: "58 mmHg",
            Valve_Area: "0.4 cm²",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "25%"
        },
        Procedure: {
            Valve_Diameter: "26 mm",
            Valve_Type: "LOTUS"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "9 mmHg",
            Peak_Gradients: "24 mmHg",
            Valve_Area: "1.8 cm²",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.12.016.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.016/images/3a0fad041eeebbe9e8e62894c26481fbf62ea2cfbaebe599190cef248371610c.jpg",
                    caption: "Image showing severe lordosis in the patient."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.016/images/8cb175e310bd50ee0e773cf082dbdc530f61a6ef11a266188d12802f4f880434.jpg",
                    caption: "Massive left pleural effusion detected by transesophageal echocardiography."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.016/images/97d0406b6292e3ca655042835ad91711c7e0ea6a947649d353212243bf71471d.jpg",
                    caption: "Rupture of left subclavian artery (white arrow)."
                },
            ]
        },
    },
    {
        id: 14,
        doi: "10.1016/j.jccase.2019.03.001",
        pmid: "31320949",
        title: "Postoperative paraplegia after transapical transcatheter aortic valve implantation",
        source: "J Cardiol Cases.",
        author: "Kazuki Mori, Tomoyuki Wada, Takashi Shuto, Aiko Kodera, Takayuki Kawashima, Hirofumi Anai, Shinji Miyamoto",
        abstract: "An 84-year-old man experienced dyspnea on exertion. He had. previously undergone percutaneous coronary intervention for. angina pectoris. At that time, aortic stenosis (As) was detected by echocardiogram. He was admitted to our hospital due to AS progression. His medical history revealed lung lobectomy for lung. cancer, and his respiratory function was markedly impaired,. causing chronic obstructive pulmonary disease.. ",
        year: 2019,
        Basic_Info: {
            Age: "84",
            Gender: "Male",
            Case: "Severe aortic valve stenosis",
            Previous_History: "Percutaneous coronary intervention for angina pectoris, lung lobectomy for lung cancer, chronic obstructive pulmonary disease"
        },
        Pre_Info: {
            Mean_Gradient: "N/A",
            Peak_Gradients: "108 mmHg",
            Valve_Area: "0.88 m²",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "26 mm",
            Valve_Type: "Tyshak"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2019.03.001.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.03.001/images/98eee3678999aaf615934bfc5a058954b56785c18b1d7e328b4de2227cb96542.jpg",
                    caption: "Preoperative contrast computed tomography. (A) Preoperative computed tomography angiogram revealed diffuse severe arteriosclerosis of the thoracic aorta including penetrating atherosclerotic ulcer. (B) Note the infra-renal abdominal aortic aneurysm with a 48 mm diameter and thick mural thrombus. (C) Mural thrombus and calcification due to arteriosclerosis from thoracic aorta to abdominal aorta."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.03.001/images/7eced0aee6d5f2c7b304917bff0f8a8ca89a483f4eefef8250a73525475314a0.jpg",
                    caption: "Postoperative magnetic resonance imaging. (A) Postoperative cerebral diffusion-weighted magnetic resonance imaging showed several small acute cerebral infarctions of the right cerebrum. (B) Spinal cord magnetic resonance imaging suggested spinal cord ischemia and edema (arrows) below the T10 spinal cord level but no hematoma."
                },
            ]
        },
    },
    {
        id: 15,
        doi: "10.1016/j.jccase.2019.04.002",
        pmid: "31440315",
        title: "Preventing brain embolism by using a modified isolation technique in transcatheter aortic valve implantation for a patient with shaggy and porcelain aorta",
        source: "J Cardiol Cases.",
        author: "Yoshikatsu Nomura, Motoharu Kawashima, Kanetsugu Nagao, Shota Hasegawa, Takanori Tsujimoto, So Izumi, Masamichi Matsumori, Tasuku Honda, Kenzo Uzu, Nobuyuki Takahashi, Takahiro Sawada, Tetsuari Onishi, Yoshinori Yasaka, Hirohisa Murakami, Nobuhiko Mukohara",
        abstract: "Transcatheter aortic valve implantation (TAvl) has become a useful and effective treatment for surgical high-risk patients with severe aortic valve stenosis (AS). Stroke is one of the most frequent complications. associated with TAvI. Shaggy and porcelain aortas are a risk factor for procedure-related strokes. Preventing brain embolism is one of the most important goals in patients with diseased aortas. We. present a case where we performed TAVI in an 89-year-old man with severe AS, a shaggy aorta, a. porcelain aorta, and congestive heart failure. TAVI via a transfemoral approach was performed using a modified isolation technique with cannulation from bilateral axillary arteries and cardiopulmonary bypass to prevent brain embolism. The catheter-delivered embolic protection device is necessary to pass the diseased aorta, but the modified isolation technique can be used without any contact with the shaggy aorta. Embolism did not occur, and his heart failure improved immediately. ",
        year: 2019,
        Basic_Info: {
            Age: "89",
            Gender: "Male",
            Case: "Severe aortic stenosis with shaggy and porcelain aorta and congestive heart failure",
            Previous_History: "History of brain infarction and chronic kidney disease"
        },
        Pre_Info: {
            Mean_Gradient: "50 mmHg",
            Peak_Gradients: "60 mmHg",
            Valve_Area: "0.8 cm²",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "30%"
        },
        Procedure: {
            Valve_Diameter: "26 mm",
            Valve_Type: "Venus"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: true,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "1.84 cm²",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2019.04.002.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.04.002/images/ffa0fb41cb7ed7a993c00a4e8917643b47a624c7a335acdcfabe57ad81bbf74d.jpg",
                    caption: "Preoperative echocardiography. (A) Echocardiographic examination before treatment showed aortic valve stenosis in the parasternal long-axis view. (B) A moderate amount of mitral regurgitation was observed in the four-chamber view."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.04.002/images/38cad91d124689775e9728ba5b9b5294a6226aa1d8fede2ae0d9051ff3be0a6a.jpg",
                    caption: "Preoperative computed tomography (CT). (A) The CT axial and sagittal image showed thrombus in the ascending aorta and the aortic arch, and this was finding of shaggy aorta. (B) The aorta generally showed a high degree of calcification, a finding of porcelain aorta."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.04.002/images/5789ad7a779684c4847372248c56c974f870a5fc163a6cc7b6e7d2c8b708cb59.jpg",
                    caption: "Photograph of the operative setup. The cardiopulmonary bypass machine was positioned behind the monitor, and to the left side of the patient. The anesthesia apparatus and transesophageal echocardiography machine were placed near the patient’s head."
                },
            ]
        },
    },
    {
        id: 16,
        doi: "10.1016/j.jccase.2019.10.003",
        pmid: "32042360",
        title: "Changes in polysomnographic findings following transcatheter aortic valve implantation in a patient with aortic stenosis",
        source: "J Cardiol Cases.",
        author: "Shinichiro Doi, Takatoshi Kasai, Shoichiro Yatsu, Sakiko Miyazaki, Shinichiro Fujimoto, Shinya Okazaki, Shizuyuki Dohi, Kenji Kuwaki, Atsushi Amano, Hiroyuki Daida",
        abstract: "Patients with aortic stenosis (AS) are likely to have sleep-disordered breathing (SDB) and improvements in AS by transcatheter or surgical aortic valve replacement alter the type and severity of SDB. However, limited data are available whether polysomnographic findings changed following transcatheter aortic valve implantation (TAVI). In this report, we describe the case of a patient with severe AS and SDB whose polysomnographic findings showed that after TAVI, sleep disturbances occurred in association with worsened periodic leg movements despite improvement in the SDB. ",
        year: 2019,
        Basic_Info: {
            Age: "75",
            Gender: "Male",
            Case: "Severe aortic stenosis with sleep-disordered breathing",
            Previous_History: "Immunosuppressive drugs for treating pure red blood cell dysplasia for the past 25"
        },
        Pre_Info: {
            Mean_Gradient: "42 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "0.6 cm²",
            Maximum_Velocity: "4.3 m/s",
            Ejection_Fraction: "70%"
        },
        Procedure: {
            Valve_Diameter: "23 mm",
            Valve_Type: "MyVal"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "16 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "1.5 cm²",
            Maximum_Velocity: "2.8 m/s"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2019.10.003.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.10.003/images/4fd4fc9416d2a0714ee3a5c76e8875901abd33dbf35a04438bf790c30c48aa25.jpg",
                    caption: "Changes in clinical parameters before and 7 months after TAVI"
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.10.003/images/0101f0e28399814bf5a2297f6b12252352e5da35c6a66e0d8d229657a4820b8d.jpg",
                    caption: "(A) Diagnostic polysomnography before TAVI. Eight occurrences of central apnea were detected, with subsequent waxing and waning hyperventilation. During central apneas, the movements of the thorax and abdomen were absent. Duration from the onset of the first breath terminating the apnea to the nadir of the subsequent dip in the SO2 measured at the finger indicates the LFCT, which is considerably long (an average of 10 consecutive apnea–hyperpnea cycles during the first episode of stage 2 sleep, 26 s). (B) Follow-up polysomnography performed 7 months after TAVI. Five occurrences of obstructive apnea were detected. During obstructive apneas, the out-of-phase movements of the thorax and abdomen were observed. LFCT was shorter than that before TAVI (an average of 10 consecutive apnea–hyperpnea cycles during the first episode of stage 2 sleep, 17 s)."
                },
            ]
        },
    },
    {
        id: 17,
        doi: "10.1016/j.jccase.2020.04.005",
        pmid: "32636966",
        title: "Coronary angioplasty post TAVI: Is the solution outside the box?",
        source: "J Cardiol Cases.",
        author: "Petros S Dardas, Efstratios K Theofilogiannakos, Dimitris Tsikaderis, Nikos E Mezilis",
        abstract: "Transcatheter aortic valve replacement (TAvR) has become the standard option for high risk patients with bioprosthetic valve degeneration. However, percutaneous coronary interventions after TAVR may be challenging as the manipulation and engagement of the guiding catheters is much more limited and difficult, due to the superimposition of the metallic frame of the TAVR valve upon the bioprosthetic cage. We describe a case of percutaneous coronary intervention in a patient with history of transcatheter aortic valve implantation after bioprosthetic valve degeneration and we describe a new method for accessing coronary arteries in cases of TAVR-in-surgical aortic valve replacement with a high-frame TAVR with a supra-annular leaflet position, by using the route outside the frame. ",
        year: 2020,
        Basic_Info: {
            Age: "81",
            Gender: "Male",
            Case: "Severe aortic stenosis and acute coronary syndrome after TAVI.",
            Previous_History: "Chronic kidney failure on hemodialysis for 10, severe bioprosthesis degeneration, and previous successful transfemoral ViV procedure."
        },
        Pre_Info: {
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "23 mm",
            Valve_Type: "Navitor"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2020.04.005.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.04.005/images/2b2aff569ed62f163f5c5e6f8139aa9f97f56e5901241700ebcce57798496746.jpg",
                    caption: "(A) Severely calcified subtotally occluded right coronary artery (RCA). (B) JR4 vertical to RCA ostium; Dual-lumen SASUKE microcatheter outside the guide catheter. (C) GUIDEZILLA advancement until mid RCA with the support of an inflated balloon distally. (D) Final angiographic result."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.04.005/images/7a8331283f189018e3e5376b45acc3e236021f8880ecc341e9f5c883043cb875.jpg",
                    caption: "(A) A schema to show a new method for accessing coronary arteries in cases of transcatheter aortic valve implantation (TAVI)-in-surgical aortic valve replacement with a high-frame TAVI with a supraannular leaflet position, by using the route outside the frame. (B) A computed tomography angiography showed very good apposition of the EVOLUT frame to the aortic wall after percutaneous coronary intervention."
                },
            ]
        },
    },
    {
        id: 18,
        doi: "10.1016/j.jccase.2020.06.012",
        pmid: "33133313",
        title: "A case with familial hypercholesterolemia complicated with severe systemic atherosclerosis intensively treated for more than 30 years",
        source: "J Cardiol Cases.",
        author: "Tetsuo Nishikawa, Hayato Tada, Tamami Nakagawa-Kamiya, Satoru Niwa, Shohei Yoshida, Mika Mori, Kenji Sakata, Atsushi Nohara, Toshinori Higashikata, Hiroki Kato, Kenji Ino, Hirofumi Takemura, Masayuki Takamura, Masa-Aki Kawashiri",
        abstract: "Worldwide, lentigo maligna melanoma (LMM) comprises 4%-15% of cutaneous melanoma and occurs less commonly than superficial spreading or nodular subtypes. We assessed the incidence of melanoma subtypes in regional and national Surveillance, Epidemiology, and End Results (SEER) cancer registry data from 1990 to 2000.. Because 30%-50% of SEER data were not classified by histogenetic type, we compared the observed SEER trends. with an age-matched population of 1024 cases from Stanford University Medical Center (SUmc) (1995-2000). SEER data revealed lentigo maligna (LM) as the most prevalent in situ subtype (79%-83%), and that LMM has been increasing at a higher rate compared with other subtypes and to all invasive melanoma combined for patients aged 45-64 and 65 y. The SUMC data demonstrated LM and LMM as the only subtypes increasing in incidence over the study period. In both groups, LM comprised >75% of in situ melanoma and LMM >27% of invasive melanoma in men 65 y and older. Regional and national SEER data suggest an increasing incidence of LM and LMM, particularly in men >age 65. An increased incidence of LM subtypes should direct melanoma screening to heavily sun-exposed. sites, where these subtypes predominate. ",
        year: 2020,
        Basic_Info: {
            Age: "N/A",
            Gender: "N/A",
            Case: "N/A",
            Previous_History: "N/A"
        },
        Pre_Info: {
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "N/A",
            Valve_Type: "PERCEVAL-S"
        },
        Result: {
            Death: "N/A",
            Paravalvular_Leak: "N/A",
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2020.06.012.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/7a15ee6af6c9652bfc5c50edc260b60576a95f2ea9dbea1a1a21922fb29f7875.jpg",
                    caption: "National Cancer Institute SEER program registry data regarding melanoma subtype incidence by region, 1990–2000, patient age range 20–99 y"
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/12b196d7b2628572d5f535eaa2a38b46c364dc0bc9300cc112db518965c6f5ca.jpg",
                    caption: "National Cancer Institute SEER program registry data, rate of melanoma incidence, 1990–2000, patient age range 20–99 y"
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/9f3f35d5460a89218be59dedd3f52a6f5fd9e8dbf34f0d5cf599f79af6181386.jpg",
                    caption: "Stanford University Medical Center melanoma subtype data, 1995–2000"
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/4a6e8b471389340a04146f3cfeaa50350958bd3c9a9c4484bdc443a26ad73f0a.jpg",
                    caption: "General characteristics and proportion of LM and LMM subtypes in the SEER and SUMC patient populations"
                },
            ]
        },
    },
    {
        id: 19,
        doi: "10.1016/j.jccase.2020.09.006",
        pmid: "32950703",
        title: "Answer to Vieira et al. \"Cytokine profile as a prognostic tool in coronavirus disease 2019\". Joint Bone Spine 2020. Doi:10.1016/j.jbspin.2020.09.006",
        source: "Joint Bone Spine.",
        author: "Luca Quartuccio, Maurizio Benucci, Salvatore De Vita",
        abstract: "Vascular complications associated with vascular closure device use is uncommon; however, it sometimes occurs in transfemoral transcatheter aortic valve implantation (TF-TAVI). We present a case of ProGlide (Abbott Vascular, Santa Clara, CA, USA)-related right femoral occlusion following TF-TAVI. An 83-year-old woman, who underwent TF-TAVI using double ProGlide pre-closure technique, presented with right claudication three days after TAVI. Computed tomography showed femoral occlusion of the puncture site. Recanalization without pressure gradient between the proximal and distal sites of the lesion was. achieved by balloon angioplasty (BA) with a 4.0 mm balloon; however, early re-occlusion of the lesion. occurred the next day after BA. Repeated BA was performed for the re-occlusion site 30 days after TAVI because of persistent claudication. Serial angioscopic images of the lesion revealed that the intima, which was injured at the first BA, had healed at the second BA, indicating that BA with larger balloons could be safely performed. We performed BA with a 6.0-mm balloon without stent implantation. The patency of the lesion was maintained during the 6-month follow-up period. The serial angioscopic findings, which revealed the healing process of the intima injury, were useful in determining a suitable endovascular therapy strategy for ProGlide-related occlusion.. ",
        year: 2020,
        Basic_Info: {
            Age: "83",
            Gender: "Female",
            Case: "Severe aortic stenosis",
            Previous_History: "N/A"
        },
        Pre_Info: {
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A",
            Ejection_Fraction: "N/A"
        },
        Procedure: {
            Valve_Diameter: "N/A",
            Valve_Type: "Portico"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2020.09.006.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.09.006/images/d026ec8d98432e6bb59116207ef8d4640bbe7a3e1a7d7b6c9c4d480f29c9ff2c.jpg",
                    caption: "Pre- and post-transcatheter aortic valve implantation (TAVI) computed tomography (CT) images and fluoroscopy, intravascular ultrasound, and angioscopy findings during the first endovascular therapy. (A) Pre-TAVI CT showing no stenosis and calcification in the right ilio-femoral artery. No vessel branches are observed near the puncture site. (B) Post-TAVI CT showing a focal occlusion (red arrowhead) of the right femoral artery (FA). (C) Fluoroscopy showing focal occlusion of the right FA. Intravascular ultrasound indicating intimal peeling at the occlusion site (yellow arrowheads). (D) Angioscopy demonstrating the captured intima of the posterior wall close to the anterior wall accompanied by intimal injury. (E) A schema illustrating the mechanism of occlusion of the femoral artery. ProGlide interferes with the intima of the posterior wall, leading to the femoral artery occlusion. (F) Fluoroscopy immediately after the first endovascular therapy"
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.09.006/images/f5e5651a09e904e94e8cdd70ea9029b5278117d21eb9b0132e9c5fe3a6e94f25.jpg",
                    caption: "Fluoroscopy, intravascular ultrasound, and angioscopy findings before the second endovascular therapy. (A) Fluoroscopy before the second endovascular therapy. Intravascular ultrasound indicating intimal peeling at the occlusion site. (B) Angioscopy demonstrating the captured intima of the posterior wall close to the anterior wall with healed intima."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.09.006/images/16bc217fe9bc8200d2907b1520b6bfaf2f4a14f9c8a8a85294e60b35faa35ac3.jpg",
                    caption: "Fluoroscopy, intravascular ultrasound, and angioscopy findings after the second endovascular therapy. (A) Fluoroscopy showing sufficient expansion at the occlusion site (white dotted line) after balloon angioplasty. (B) Intravascular ultrasound and (C) angioscopy showing sufficient lumen area at the occlusion site."
                },
            ]
        },
    },
    {
        id: 20,
        doi: "10.1016/j.jccase.2021.02.002",
        pmid: "34354784",
        title: "Transcatheter aortic valve implantation in rheumatic aortic stenosis with a functioning mitral prosthesis",
        source: "J Cardiol Cases.",
        author: "Taro Ichise, Tomohito Mabuchi, Masahiro Uehara, Yuji Takashima, Yoji Nagata, Yoshio Yamaguchi, Ikuo Moriuchi, Tatsuaki Murakami, Osamu Monta, Kazuo Ohsato",
        abstract: "Transcatheter aortic valve implantation (TAvI) for patients with rheumatic aortic stenosis (AS) is not wellknown. We herein report a case of TAVI in rheumatic AS without significant calcification and prior mitral. valve replacement. An 80-year-old woman underwent TAVI for severe AS. Preoperative computed tomography revealed tricuspid aortic valve leaflets with commissural fusion, minimal calcification, and a minimal distance between the aortic annulus and mechanical mitral valve. TAVI was performed through a. transfemoral approach under general anesthesia. After predilatation of the aortic valve with a 20-mm balloon, a 23-mm SAPIEN 3 valve was successfully deployed via slow inflation. Valve embolization did not occur, and the valve did not interfere with the prosthetic mitral leaflets. This report shows that TAVI. can be safe, feasible, and effective in patients with rheumatic AS without significant calcification and. prior mitral valve replacement. ",
        year: 2021,
        Basic_Info: {
            Age: "80",
            Gender: "Female",
            Case: "Rheumatic aortic stenosis with a functioning mitral prosthesis",
            Previous_History: "Mitral valve replacement with a prosthetic mechanical mitral valve (27-mm St. Jude Medical prosthesis) 23 earlier for rheumatic mitral stenosis"
        },
        Pre_Info: {
            Mean_Gradient: "40.6 mmHg",
            Peak_Gradients: "N/A",
            Valve_Area: "0.88 cm²",
            Maximum_Velocity: "406 cm/s",
            Ejection_Fraction: "61%"
        },
        Procedure: {
            Valve_Diameter: "23 mm",
            Valve_Type: "St Jude"
        },
        Result: {
            Death: false,
            Paravalvular_Leak: false,
            Mean_Gradient: "N/A",
            Peak_Gradients: "N/A",
            Valve_Area: "N/A",
            Maximum_Velocity: "N/A"
        },
        Files: {
            PDF: "D:/Romy/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2021.02.002.pdf",
            Images: [
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2021.02.002/images/9146f8760e8221dd82823480051ea1ef9185fbec8e1b1fc8c2695badc846f566.jpg",
                    caption: "Transthoracic echocardiogram revealed severe aortic valve stenosis with peak velocity through the aortic valve 406 cm/sec and the mean pressure gradient was 40.6 mmHg (A). The aortic valve area by planimetry was 0.88 cm2. The aortic valve was tricuspid without significant calcification (B)."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2021.02.002/images/36c62e8b295a7f50c4c67fe173bb0bced787407c8802cbc7091b2628d368ac37.jpg",
                    caption: "Computed tomography of the aortic valve in systolic (A) and diastolic phase (B) showing fibrous thickening, commissural fusion between the left and right cusps, very minimal calcification, and a minimal distance between the aortic annulus and mechanical mitral valve illustrating three-dimensional volumetric reconstructions (C) and long-axis views (D)."
                },
                {
                    path: "D:/Romy/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2021.02.002/images/e58de5eb7e339587b3cc6878efe45cf974797ed5a08c2a372d8aa4e17f485a33.jpg",
                    caption: "The white line depicts the perpendicular aortic annulus view (A). A 23-mm SAPIEN 3 valve was meticulously positioned slightly higher (B), and slowly deployed by 1-ml underfilling during rapid ventricular pacing (C). The transcatheter heart valve had good form and position demonstrated by computed tomography illustrating three-dimensional volumetric reconstructions (D) and long-axis views (E, F)."
                },
            ]
        },
    }
]; 