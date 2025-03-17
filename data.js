// TAVI病例数据
const taviCases = [
    {
        id: 1,
        doi: "10.1016/j.jccase.2017.08.003",
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
            Valve_Type: "Sapien XT"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.08.003.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.003/images/04f1957974dfc35dd6d9cbcf1c41e25285fda908b1a950c56c92ffe3d645cb9e.jpg",
                    caption: "Perioperative clinical course."
                },
            ]
        }
    },
    {
        id: 2,
        doi: "10.1016/j.jccase.2017.08.016",
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
            Valve_Type: "Edwards-Sapien S3"
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
                PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.08.016.pdf",
                Images: [
                    {
                        path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/8132b96912747324e80d47e5093f9ca76e8f0e49403f8a5defe15f77c04774e5.jpg",
                        caption: "Computed tomography angiogram displaying double-oblique projections along the aortic root axis from multiplanar reconstruction showing: (A) calcification on the bicuspid aortic valve along with dilated ascending aorta; (B) elucidation of the angle between ascending aorta and the plane of the bicuspid aortic valve."
                    },
                    {
                        path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/c310fe760bb94125a0fe6b9788226e72bed10f50f6245166b496885cbe39acac.jpg",
                        caption: "(A) Computed tomography angiogram displaying a double-oblique projection of the aorta from multiplanar reconstruction showing dilated ascending aorta, 90 angle in the arch at the junction of the transverse and descending aorta (arrow) and tortuosity in the descending thoracic aorta. (B) 3D reformatted angiogram of the aorta showing the above abnormalities."
                    },
                    {
                        path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/d7e1dce80b9ef308d093042a0a6a97e61f49162a95fe6229ecfec6dd7ffd9122.jpg",
                        caption: "Cine angiogram during positioning and deployment of the Edwards Sapien S3 valve. (A) Alignment and positioning of the valve using the advantage of the flexible sheath. (B) Deployment of the valve and annular fixation by balloon inflation. (C) Post valve-deployment image."
                    },
                    {
                        path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.08.016/images/ff9f08cf5073d611d0c7ec06084c4a41416b0d98441f6d2221d99d497d62809c.jpg",
                        caption: "Computed tomography angiogram displaying double-oblique projection along the bicuspid aortic valve annular plane from multiplanar reconstruction showing asymmetric calcification of the aortic leaflets."
                    }
                ]
            }
    },
    {
        id: 3,
        doi: "10.1016/j.jccase.2017.11.003",
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.11.003.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.11.003/images/a6c2dabb70d1bca031aad3527bde50e20357abb418b517a33e63a6ab249c5004.jpg",
                    caption: "The intraoperative findings. The sealing skirt of CoreValve was stuck to the aortic wall except for the commissure between the non-coronary cusp and the left coronary cusp. There was a reduction in blood flow from the aorta to the sinus of Valsalva because of the small gap (blue circle)."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.11.003/images/b02626a3ec8eed219a2302f92527fd3713095dc0242d65428b780898acca2ef4.jpg",
                    caption: "The first coronary angiographic finding. The 26-mm CoreValve prosthesis was deployed at a high position, at a depth of -2 mm. Aortic angiography indicated normal contrast flow into both coronary arteries."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.11.003/images/f006eb1350ae2fbbe4fed4abee9b2370c74c314c7ebd676b7e6cdec8b4be6b88.jpg",
                    caption: "(Left) The schema of the intraoperative finding. (Right) The second coronary angiographic finding. The blood flow perfused not directly to the right coronary cusp, but by a roundabout route from the left coronary cusp because of the adhesion between the transition zone (sealing skirt) of CoreValve and the aorta around the non-coronary cusp."
                },
            ]
        }
    },
    {
        id: 4,
        doi: "10.1016/j.jccase.2017.12.001",
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2017.12.001.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.12.001/images/fbf5e123e097a6bccd5ece99ec783695a0ddbbf6bca868613ec30b466a6fd784.jpg",
                    caption: "A cross-sectional computed tomography image showing an abdominal aortic aneurysm (AAA) with a diameter of 57 mm. AAA ranged from just beneath the branch of the renal artery to the proximal part of the common iliac artery on both sides."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.12.001/images/41e0f21fc75a773f98d5393fbc102e65bb26ed068ae7989bfab615763164f083.jpg",
                    caption: "Valve implantation. A 26 mm CoreValve was placed in the appropriate location."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2017.12.001/images/11cebbc140d23da6c56e9a3bdc3992b27f5d70ba94bd23aa73cb7bcb1c362086.jpg",
                    caption: "Angiograms of the abdominal aortic aneurysm pre- and post-endovascular aneurysm repair. An excellent final angiographic image, which did not exhibit endoleak, was obtained."
                },
            ]
        }
    },
    {
        id: 5,
        doi: "10.1016/j.jccase.2018.01.002",
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
            Valve_Type: "Sapien XT"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.01.002.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.002/images/ca30ab5790ecd9ee95552e4b4b7be905a6064a5dd5103dd3f3db6abf77222605.jpg",
                    caption: "(A) Colonoscopy showing advanced colon cancer (yellow arrowhead) and obstruction. (B) Contrast-enhanced computed tomography demonstrating colon cancer (red arrowhead) and obstructive ileus. (C) Colonic stenting resolved the obstruction caused by advanced colon cancer."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.002/images/31ab825752a1e3b7444c7ef3b85e598d9efa342dc7057e7a3aefef6101086d6c.jpg",
                    caption: "Fluoroscopy during transcatheter aortic valve implantation. (A) Implantation of 23-mm Sapien XT valve. (B) Aortography after valve deployment."
                },
            ]
        }
    },
    {
        id: 6,
        doi: "10.1016/j.jccase.2018.01.010",
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
            Valve_Type: "Edwards CENTERA TM 29"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.01.010.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.010/images/4953a1215caa47f597f1729ec178ea9d6d06883c142cff621c720d2e3a8c4c0f.jpg",
                    caption: "(A) Echocardiographic examination before transcatheter aortic valve implantation (TAVI). Above: Time-velocity graph at Doppler echocardiography denoting severe aortic stenosis. Below: The left ventricular outflow tract (LVOT) in parasternal long-axis view. (B) Control echocardiographic examination 6 months after TAVI. Above: a normal profile of the time-velocity curve is registered. Below: The LVOT diameter is reduced compared to baseline (from 2.2 cm to 1.6 cm)."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.010/images/9afd74883eb7fa62f99905dac9e35ca687c99ab562993448942e704bdd03325d.jpg",
                    caption: "Baseline electrocardiographic recording (sinus rhythm, PR interval 200 ms, non-specific repolarization abnormalities)."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.01.010/images/eaba4553763b0894ccaad9893f08f18497dfaaf9c92054a2922250c0eaa657ce.jpg",
                    caption: " Implantable loop recorder registration during syncope, demonstrating paroxysmal complete atrioventricular block and wide QRS escape rhythm. Arrows indicate evident P waves."
                },
            ]
        }
    },
    {
        id: 7,
        doi: "10.1016/j.jccase.2018.02.004",
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
            Valve_Type: "CoreValve EvolutR"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.02.004.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.02.004/images/a1c798ac51081c67b84507d60d7c0c06a1d119cc197cdf4f8d947fb9a0a39160.jpg",
                    caption: "Computed tomography (CT) showing an inverted (rightward) orientation of the ventricle apex and great vessels. (A) CT at the level of the aortic arch. (B) CT at the level of the heart. (C) CT showing a longitudinal sectional view of the aortic annulus. The aortic root angulation was 50."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.02.004/images/ece5353685704025c6862a4ee6752e9070e55768991aa15ec63d3a96cb4884af.jpg",
                    caption: "Normal and reversed fluoroscopic images. (A) A normal image. (B) A left and right reversed image."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.02.004/images/902615d7cc0746fb34e19ad5e61be2712692b46e5fcfdf5aef93134c703b0066.jpg",
                    caption: "A fluoroscopic image showing a 26-mm CoreValve Evolut R deployed at the aortic annulus."
                },
            ]
        }
    },
    {
        id: 8,
        doi: "10.1016/j.jccase.2018.06.007",
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
            Valve_Type: "Lotus valve"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.06.007.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.06.007/images/a5cac0f78f404d51a6aedbfbf671638db0159ef73ba34b88530734891d6a5bda.jpg",
                    caption: "3D transesophageal echocardiography was used in order to measure annulus size and guide the selection of an appropriately sized valve prosthesis. Multi-planar reformatting was used in order to generate coronal, axial, and sagittal views as shown."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.06.007/images/21097300148c82288465c17df595b8410b6ad2bab6dc8e4c64117c9395857973.jpg",
                    caption: "(A) A pigtail catheter, positioned in the non-coronary sinus without use of contrast, as well as the heavy calcification of the aortic valve was used to aid in the positioning of the Lotus valve. (B) The Lotus valve in situ following deployment."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.06.007/images/870781d752202b0187c55bb3122515c0224099b94280f9a2bd0c2a6110748d2f.jpg",
                    caption: "Intra-procedural transesophageal echocardiography images demonstrating only trivial paravalvular regurgitation following deployment of the TAVI prosthesis. LA, left atrium; RA, right atrium; RV, right ventricle; IAS, inter-atrial septum; NCS, non-coronary sinus; LCS, left coronary sinus; RCS, right coronary sinus; LVOT, left ventricular outflow tract; AMVL, anterior mitral valve leaflet; TAVI, trans-catheter aortic valve implantation."
                },
            ]
        }
    },
    {
        id: 9,
        doi: "10.1016/j.jccase.2018.07.005",
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
            Valve_Type: "CoreValveTM"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.07.005.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/d33be38ee097a63fed77ae9fed3bbcd8be2cdd6b8fd8031dcf7b3cbd9770360b.jpg",
                    caption: "Chest thin-slice computed tomography before transcatheter aortic valve implantation. Chest thin-slice computed tomography confirmed reticulation and honeycombing in the bilateral dorsal and lower lung fields, which was consistent with usual interstitial pneumonia pattern of baseline idiopathic pulmonary fibrosis."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/b57d413734ffb549def742101933abdd0380a282fb4bd3fbcee3f542e8c349f4.jpg",
                    caption: "Chest radiography and thin-slice computed tomography evaluation findings with laboratory data and echocardiographic findings. Ground-glass opacities in the bilateral lungs with elevated tricuspid regurgitation pressure gradient (TRPG) and E-wave velocity were detected on postoperative day (POD) 14. Following treatment of congestive heart failure, computed tomography (CT) showed improvement in ground-glass opacities with residual reticulation on POD 60, along with a temporal decrease in brain natriuretic peptide (BNP) level and improvement in echocardiographic findings. "
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/8f4651055836635a6c8c9435eadda8c4d8e5377d40eedd082246d1241fbccbfb.jpg",
                    caption: "On POD 70, development of new diffuse ground-glass opacities was seen in the bilateral lung fields without evidence of left heart failure, which was diagnosed as an exacerbation of idiopathic pulmonary fibrosis. Re-elevation of BNP level and TRPG on POD 70 were consistent with right ventricular overload and pulmonary hypertension due to exacerbation of idiopathic pulmonary fibrosis. Note consistent and progressive increase in Krebs von den lungen-6 (KL-6)."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.07.005/images/dc72b4d34dc8eb7254f5d31b545eb0ab6e4ca4f9f8ca6ebcdaaef34386d5dbe6.jpg",
                    caption: "Laboratory data before transcatheter aortic valve implantation (TAVI) and at readmission."
                },
            ]
        }
    },
    {
        id: 10,
        doi: "10.1016/j.jccase.2018.09.007",
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
            Valve_Type: "SAPIEN 3"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.09.007.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.09.007/images/6d2e3360d2c4dcfbfc65618681f4c69cfead47dd2bae71a11101e18e7d778e73.jpg",
                    caption: "(A) Preprocedural computed tomography showing heavily calcified leaflets, especially at the non-coronary cusp. RCC, right coronary cusp; LCC, left coronary cusp; NCC non-coronary cusp. (B) Preprocedural computed tomography showing the left coronary height from the annulus. (C) Serial hemoglobin measurements during the periprocedural period. EVL, endoscopic variceal ligation; Hb, hemoglobin; TAVI, transcatheter aortic valve implantation. (D) Intraprocedural angiography of a 20-mm SAPIEN3 prosthesis implantation with protection for the left main coronary artery using a guiding catheter. The balloon indentation shows severe calcification (dashed circle). (E) Intraprocedural transesophageal echocardiogram showing the transcatheter heart valve (solid arrow) positioned at the edge of the annulus opposite the heavily calcified leaflet at the non-coronary cusp (dashed arrow). (F) Transesophageal echocardiogram showing mild paravalvular leak (solid arrow) from the gap between the transcatheter heart valve and heavily calcified leaflets. (G) The crossover balloon technique for performing percutaneous closure to reduce bleeding from the access site. During inflation of an 8.0 40-mm balloon to low pressure in the external iliac artery, the main introducer sheath was withdrawn and the access site was secured with a percutaneous closure system. (H) Final femoral angiogram shows the injection of contrast material from the tip of the over-the-wire balloon and that hemostasis at the access site was achieved. (I) The postprocedural computed tomography showing the transcatheter heart valve (solid arrow) seated opposite the heavily calcified leaflet at the non-coronary cusp (dashed arrow)."
                },
            ]
        }
    },
    {
        id: 11,
        doi: "10.1016/j.jccase.2018.12.001",
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
            Valve_Type: "Evolut RT"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.12.001.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.001/images/ec40128f3299d5517a6bbf9fa074267c8fe6e339cf3003e5f7e67a90e463a3d0.jpg",
                    caption: "Pre-transcatheter aortic valve implantation computed tomography (CT) images. (A) 3D reconstructed image demonstrating significant tortuosity and aneurysmal segments within the ileo-femoral vessels. (B) An axial cross-sectional image, used to determine the optimal site of access for the left femoral artery. (C and D) 3D reconstructed images demonstrating the extent of calcification within both ileo-femoral arteries."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.001/images/7f126128c44fe7c9a0866c13c84b4cc6720d41648ea87797a2aafa90acc7b542.jpg",
                    caption: "The MANTA device. (1–6) Schematic representation of the steps involved in the deployment of the MANTA. In the present case, steps 1 and 2 were omitted since the device was used as a rescue rather than electively. Images provided by Essential Medical Inc., Malvern, PA, USA."
                },
            ]
        }
    },
    {
        id: 12,
        doi: "10.1016/j.jccase.2018.12.011",
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
            Valve_Type: "SAPIEN 3"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.12.011.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.011/images/7c0054db1364680acf5f0ad913c8910995b8a14db8f5838e50a9e607b5dee4a2.jpg",
                    caption: "(A) Transthoracic echocardiography showing a continuous wave Doppler image of severe aortic stenosis obtained from apical 5-chamber view before transcatheter aortic valve replacement. Coronary angiography showing a (B) right coronary artery (arrow head) and distal left coronary artery from conus branch (arrow). (C) Proximal left coronary artery from the right coronary sinus and severe calcified aortic valve (arrow head). Coronary aorta computed tomography angiography showing a (D) bifurcation and anomalous origin of the left coronary artery at the right coronary sinus (yellow arrow). (E and F) Proximal left coronary artery via retroaortic course adjacent to the sinotubular junction (yellow arrow) (G) Schematic diagram of relationship between coronary arteries and valves."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.011/images/9175ead190892f104788c395df034cc49fbbb4a65d7b730cf014964e97b7bca6.jpg",
                    caption: "Coronary aorta computed tomography angiography showing the size of (A) sinus of Valsalva and (B) sinotubular junction, (C) the aortic annular area and the annulus area-driven and perimeter-driven diameters, and (D) the distance of the right coronary ostia from aortic annulus plane. Aortography during the procedure, (E) before TAVR. (F) after TAVR. (G) Transthoracic echocardiography showing a continuous wave Doppler image of aortic valve obtained from apical 5- chamber view after TAVR."
                },
            ]
        }
    },
    {
        id: 13,
        doi: "10.1016/j.jccase.2018.12.016",
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
            Valve_Type: "Medtronic CoreValve Evolut R"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2018.12.016.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.016/images/3a0fad041eeebbe9e8e62894c26481fbf62ea2cfbaebe599190cef248371610c.jpg",
                    caption: "Image showing severe lordosis in the patient."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.016/images/8cb175e310bd50ee0e773cf082dbdc530f61a6ef11a266188d12802f4f880434.jpg",
                    caption: "Massive left pleural effusion detected by transesophageal echocardiography."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2018.12.016/images/97d0406b6292e3ca655042835ad91711c7e0ea6a947649d353212243bf71471d.jpg",
                    caption: "Rupture of left subclavian artery (white arrow)."
                },
            ]
        }
    },
    {
        id: 14,
        doi: "10.1016/j.jccase.2019.03.001",
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
            Valve_Type: "Sapien XT"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2019.03.001.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.03.001/images/98eee3678999aaf615934bfc5a058954b56785c18b1d7e328b4de2227cb96542.jpg",
                    caption: "Preoperative contrast computed tomography. (A) Preoperative computed tomography angiogram revealed diffuse severe arteriosclerosis of the thoracic aorta including penetrating atherosclerotic ulcer. (B) Note the infra-renal abdominal aortic aneurysm with a 48 mm diameter and thick mural thrombus. (C) Mural thrombus and calcification due to arteriosclerosis from thoracic aorta to abdominal aorta."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.03.001/images/7eced0aee6d5f2c7b304917bff0f8a8ca89a483f4eefef8250a73525475314a0.jpg",
                    caption: "Postoperative magnetic resonance imaging. (A) Postoperative cerebral diffusion-weighted magnetic resonance imaging showed several small acute cerebral infarctions of the right cerebrum. (B) Spinal cord magnetic resonance imaging suggested spinal cord ischemia and edema (arrows) below the T10 spinal cord level but no hematoma."
                },
            ]
        }
    },
    {
        id: 15,
        doi: "10.1016/j.jccase.2019.04.002",
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
            Valve_Type: "SAPIEN 3"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2019.04.002.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.04.002/images/ffa0fb41cb7ed7a993c00a4e8917643b47a624c7a335acdcfabe57ad81bbf74d.jpg",
                    caption: "Preoperative echocardiography. (A) Echocardiographic examination before treatment showed aortic valve stenosis in the parasternal long-axis view. (B) A moderate amount of mitral regurgitation was observed in the four-chamber view."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.04.002/images/38cad91d124689775e9728ba5b9b5294a6226aa1d8fede2ae0d9051ff3be0a6a.jpg",
                    caption: "Preoperative computed tomography (CT). (A) The CT axial and sagittal image showed thrombus in the ascending aorta and the aortic arch, and this was finding of shaggy aorta. (B) The aorta generally showed a high degree of calcification, a finding of porcelain aorta."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.04.002/images/5789ad7a779684c4847372248c56c974f870a5fc163a6cc7b6e7d2c8b708cb59.jpg",
                    caption: "Photograph of the operative setup. The cardiopulmonary bypass machine was positioned behind the monitor, and to the left side of the patient. The anesthesia apparatus and transesophageal echocardiography machine were placed near the patient’s head."
                },
            ]
        }
    },
    {
        id: 16,
        doi: "10.1016/j.jccase.2019.10.003",
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
            Valve_Type: "SAPIEN 3"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2019.10.003.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.10.003/images/4fd4fc9416d2a0714ee3a5c76e8875901abd33dbf35a04438bf790c30c48aa25.jpg",
                    caption: "Changes in clinical parameters before and 7 months after TAVI"
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2019.10.003/images/0101f0e28399814bf5a2297f6b12252352e5da35c6a66e0d8d229657a4820b8d.jpg",
                    caption: "(A) Diagnostic polysomnography before TAVI. Eight occurrences of central apnea were detected, with subsequent waxing and waning hyperventilation. During central apneas, the movements of the thorax and abdomen were absent. Duration from the onset of the first breath terminating the apnea to the nadir of the subsequent dip in the SO2 measured at the finger indicates the LFCT, which is considerably long (an average of 10 consecutive apnea–hyperpnea cycles during the first episode of stage 2 sleep, 26 s). (B) Follow-up polysomnography performed 7 months after TAVI. Five occurrences of obstructive apnea were detected. During obstructive apneas, the out-of-phase movements of the thorax and abdomen were observed. LFCT was shorter than that before TAVI (an average of 10 consecutive apnea–hyperpnea cycles during the first episode of stage 2 sleep, 17 s)."
                },
            ]
        }
    },
    {
        id: 17,
        doi: "10.1016/j.jccase.2020.04.005",
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
            Valve_Type: "MOSAIC bioprosthesis"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2020.04.005.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.04.005/images/2b2aff569ed62f163f5c5e6f8139aa9f97f56e5901241700ebcce57798496746.jpg",
                    caption: "(A) Severely calcified subtotally occluded right coronary artery (RCA). (B) JR4 vertical to RCA ostium; Dual-lumen SASUKE microcatheter outside the guide catheter. (C) GUIDEZILLA advancement until mid RCA with the support of an inflated balloon distally. (D) Final angiographic result."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.04.005/images/7a8331283f189018e3e5376b45acc3e236021f8880ecc341e9f5c883043cb875.jpg",
                    caption: "(A) A schema to show a new method for accessing coronary arteries in cases of transcatheter aortic valve implantation (TAVI)-in-surgical aortic valve replacement with a high-frame TAVI with a supraannular leaflet position, by using the route outside the frame. (B) A computed tomography angiography showed very good apposition of the EVOLUT frame to the aortic wall after percutaneous coronary intervention."
                },
            ]
        }
    },
    {
        id: 18,
        doi: "10.1016/j.jccase.2020.06.012",
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
            Valve_Type: "N/A"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2020.06.012.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/7a15ee6af6c9652bfc5c50edc260b60576a95f2ea9dbea1a1a21922fb29f7875.jpg",
                    caption: "National Cancer Institute SEER program registry data regarding melanoma subtype incidence by region, 1990–2000, patient age range 20–99 y"
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/12b196d7b2628572d5f535eaa2a38b46c364dc0bc9300cc112db518965c6f5ca.jpg",
                    caption: "National Cancer Institute SEER program registry data, rate of melanoma incidence, 1990–2000, patient age range 20–99 y"
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/9f3f35d5460a89218be59dedd3f52a6f5fd9e8dbf34f0d5cf599f79af6181386.jpg",
                    caption: "Stanford University Medical Center melanoma subtype data, 1995–2000"
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.06.012/images/4a6e8b471389340a04146f3cfeaa50350958bd3c9a9c4484bdc443a26ad73f0a.jpg",
                    caption: "General characteristics and proportion of LM and LMM subtypes in the SEER and SUMC patient populations"
                },
            ]
        }
    },
    {
        id: 19,
        doi: "10.1016/j.jccase.2020.09.006",
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
            Valve_Type: "N/A"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2020.09.006.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.09.006/images/d026ec8d98432e6bb59116207ef8d4640bbe7a3e1a7d7b6c9c4d480f29c9ff2c.jpg",
                    caption: "Pre- and post-transcatheter aortic valve implantation (TAVI) computed tomography (CT) images and fluoroscopy, intravascular ultrasound, and angioscopy findings during the first endovascular therapy. (A) Pre-TAVI CT showing no stenosis and calcification in the right ilio-femoral artery. No vessel branches are observed near the puncture site. (B) Post-TAVI CT showing a focal occlusion (red arrowhead) of the right femoral artery (FA). (C) Fluoroscopy showing focal occlusion of the right FA. Intravascular ultrasound indicating intimal peeling at the occlusion site (yellow arrowheads). (D) Angioscopy demonstrating the captured intima of the posterior wall close to the anterior wall accompanied by intimal injury. (E) A schema illustrating the mechanism of occlusion of the femoral artery. ProGlide interferes with the intima of the posterior wall, leading to the femoral artery occlusion. (F) Fluoroscopy immediately after the first endovascular therapy"
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.09.006/images/f5e5651a09e904e94e8cdd70ea9029b5278117d21eb9b0132e9c5fe3a6e94f25.jpg",
                    caption: "Fluoroscopy, intravascular ultrasound, and angioscopy findings before the second endovascular therapy. (A) Fluoroscopy before the second endovascular therapy. Intravascular ultrasound indicating intimal peeling at the occlusion site. (B) Angioscopy demonstrating the captured intima of the posterior wall close to the anterior wall with healed intima."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2020.09.006/images/16bc217fe9bc8200d2907b1520b6bfaf2f4a14f9c8a8a85294e60b35faa35ac3.jpg",
                    caption: "Fluoroscopy, intravascular ultrasound, and angioscopy findings after the second endovascular therapy. (A) Fluoroscopy showing sufficient expansion at the occlusion site (white dotted line) after balloon angioplasty. (B) Intravascular ultrasound and (C) angioscopy showing sufficient lumen area at the occlusion site."
                },
            ]
        }
    },
    {
        id: 20,
        doi: "10.1016/j.jccase.2021.02.002",
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
            Valve_Type: "SAPIEN 3"
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
            PDF: "E:/SAIRI/TAVI/Code/pdf_downloads/10.1016_j.jccase.2021.02.002.pdf",
            Images: [
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2021.02.002/images/9146f8760e8221dd82823480051ea1ef9185fbec8e1b1fc8c2695badc846f566.jpg",
                    caption: "Transthoracic echocardiogram revealed severe aortic valve stenosis with peak velocity through the aortic valve 406 cm/sec and the mean pressure gradient was 40.6 mmHg (A). The aortic valve area by planimetry was 0.88 cm2. The aortic valve was tricuspid without significant calcification (B)."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2021.02.002/images/36c62e8b295a7f50c4c67fe173bb0bced787407c8802cbc7091b2628d368ac37.jpg",
                    caption: "Computed tomography of the aortic valve in systolic (A) and diastolic phase (B) showing fibrous thickening, commissural fusion between the left and right cusps, very minimal calcification, and a minimal distance between the aortic annulus and mechanical mitral valve illustrating three-dimensional volumetric reconstructions (C) and long-axis views (D)."
                },
                {
                    path: "E:/SAIRI/TAVI/Code/extract_downloads/10.1016_j.jccase.2021.02.002/images/e58de5eb7e339587b3cc6878efe45cf974797ed5a08c2a372d8aa4e17f485a33.jpg",
                    caption: "The white line depicts the perpendicular aortic annulus view (A). A 23-mm SAPIEN 3 valve was meticulously positioned slightly higher (B), and slowly deployed by 1-ml underfilling during rapid ventricular pacing (C). The transcatheter heart valve had good form and position demonstrated by computed tomography illustrating three-dimensional volumetric reconstructions (D) and long-axis views (E, F)."
                },
            ]
        }
    }
]; 