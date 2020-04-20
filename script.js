// @ts-nocheck



const rows = document.querySelectorAll('.form-group')
const calculate = document.querySelector('button');
const total = document.querySelector('span#total');
const pFreg = document.querySelector('#pFreq');
const qFreg = document.querySelector('#qFreq');
const chiSpan = document.querySelector('#chi');
const resultStatic = document.querySelector('#resultStat');



const geneticCalc = {
    total: 0,
    AAt: 0,
    Aat: 0,
    aat: 0,
    AA: 0,
    Aa: 0,
    aa:0,
    pFreg: 0,
    qFreg: 0,
    ExpFregAA: 0,
    ExpFregAa: 0,
    ExpFregaa: 0,
    ExpAA: 0,
    ExpAa: 0,
    Expaa:0
}


calculate.addEventListener('click', () => {
    let totalCalc = 0;

    rows.forEach(row => {
        const [label, input] = row.children;
        const id = `${label.id}t`;
        geneticCalc[id] = Number(input.value);
        totalCalc += Number(input.value);
    })
    geneticCalc.total = totalCalc;
    total.innerHTML = `${totalCalc}`;

    rows.forEach(row => {
        const [label] = row.children;
        geneticCalc[`${label.id}`] = (geneticCalc[`${label.id}t`] / geneticCalc.total);
    })

    console.log(geneticCalc);

    function setRowInTable(rowId,id) {
        const childs = document.querySelector(rowId).children;
        childs[1].innerText = geneticCalc[`${id}t`];
        childs[2].innerText = geneticCalc[id].toFixed(3);
    }
   
    setRowInTable('#D', 'AA');
    setRowInTable('#H', 'Aa');
    setRowInTable('#R', 'aa');

    geneticCalc['pFreg'] = geneticCalc['AA'] + geneticCalc['Aa'] * 1 / 2;
    geneticCalc['qFreg'] = geneticCalc['aa'] + geneticCalc['Aa'] * 1 / 2;

    pFreg.innerText = geneticCalc['pFreg'].toFixed(3);
    qFreg.innerText = geneticCalc['qFreg'].toFixed(3);

    geneticCalc['ExpFregAA'] = Math.pow(geneticCalc.pFreg,2);
    geneticCalc['ExpFregAa'] = geneticCalc.pFreg * geneticCalc.qFreg * 2;
    geneticCalc['ExpFregaa'] = Math.pow(geneticCalc.qFreg,2);

    document.querySelector('#ExpFregAA').innerText = geneticCalc['ExpFregAA'];
    document.querySelector('#ExpFregAa').innerText = geneticCalc['ExpFregAa'];
    document.querySelector('#ExpFregaa').innerText = geneticCalc['ExpFregaa'];

    geneticCalc.ExpAA = geneticCalc.ExpFregAA * geneticCalc.total
    geneticCalc.ExpAa = geneticCalc.ExpFregAa * geneticCalc.total
    geneticCalc.Expaa = geneticCalc.ExpFregaa * geneticCalc.total

    const arrayExp = [geneticCalc.ExpAA, geneticCalc.ExpAa, geneticCalc.Expaa];
 
    const Chi = [geneticCalc.AAt, geneticCalc.Aat, geneticCalc.aat].map(
        (ele, index) => (Math.pow(ele - arrayExp[index],2) / arrayExp[index])
    ).reduce((acc, current) => acc + current);

    const chiTable = ss.chiSquaredDistributionTable['2'];
    let findSmallest;
    let percentage;

    if (Chi < 0.01) {
        percentage = 0.999;
    } else if (Chi > 10.6) {
        percentage = '0.000';
    } else {
        for (let key in chiTable) {
            let v = Chi - chiTable[key];
            if (!findSmallest || findSmallest > v) {
                findSmallest = v;
                percentage = key;
            }
        }
    }

    const notGood = `Zgodność wystarczająca słaba - model jest nieodpowiedni`;
    const Good = `Zgodność na tyle duża żeby nie odrzucać modelu`;

    chiSpan.innerText = `χ2 = ${Chi.toFixed(3)}`;
    resultStatic.innerText = (percentage <= 0.05) ? notGood : Good;

})