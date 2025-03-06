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
        }
    }
]; 