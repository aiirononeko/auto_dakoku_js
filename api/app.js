// エクセルファイルを操作するライブラリ
const XlsxPopulate = require('xlsx-populate');

// AWSで使用するライブラリ
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fs  = require('fs');

// 現在時刻を取得
const date = new Date();

// 取得した現在時刻から、打刻時刻を算出
const startTime = getFormattedTime(date); // 勤務開始時間
const endTime = getFormattedTime(date); // 勤務終了時間
const rest = 1.0; // 休憩時間
const workTime = getFormattedWorkTime(startTime, endTime, rest); // 労働時間
const overTime = getFormattedOverTime(startTime, endTime); // 残業時間

// time.getHours()とtime.getMinutes()で取得した値を、'00:00'の形式にして返却する関数
function getFormattedTime(date) {
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  // 30分刻みに打刻時刻を修正する
  if (minutes < 30) {
    minutes = '00'
  } else {
    minutes = '30'
  }

  return `${hours}:${minutes}`;
}

// startTimeとendTimeとrestからworkTimeを算出して、'0.0'の形式にして返却する関数
function getFormattedWorkTime(startTime, endTime, rest) {
  return 8.0;
}

// startTimeとendTimeからoverTime(残業時間)を算出して、'0.0'の形式にして返却する関数
function getFormattedOverTime(startTime, endTime) {
  return 0.0;
}

// Lambdaハンドラ
exports.handler = (event, context, callback) => {

  const isComming = event.key; // trueなら出勤、falseなら退勤

  const params = {
    Bucket: 'autodakoku',
    Key: '勤怠請負用(2020)_片田.xlsm',
  }

  s3.getObject(params, (err, data) => {
    console.log(data.Body);

    XlsxPopulate.fromDataAsync(data.Body)
      .then((workbook) => {

        console.log('処理を開始しました');

        let sheetNumber;
        switch(date.getMonth() + 1) {
          case 1: // 1月
              sheetNumber = '01';
              break;
            case 2: // 2月
              sheetNumber = '02';
              break;
            case 3: // 3月
              sheetNumber = '03';
              break;
            case 4: // 4月
              sheetNumber = '04';
              break;
            case 5: // 5月
              sheetNumber = '05';
              break;
            case 6: // 6月
              sheetNumber = '06';
              break;
            case 7: // 7月
              sheetNumber = '07';
              break;
            case 8: // 8月
              sheetNumber = '08';
              break;
            case 9: // 9月
              sheetNumber = '09';
              break;
            case 10: // 10月
              sheetNumber = '10';
              break;
            case 11: // 11月
              sheetNumber = '11';
              break;
            case 12: // 12月
              sheetNumber = '12';
              break;
        }

        console.log(`操作するシートは${sheetNumber}です`);

        const sheetName = workbook.sheet(sheetNumber);
        const colNumber = (date.getDate() + 3).toString();

        if (isComming) {
          const startTimeValue = sheetName.cell(`D${colNumber}`).value(startTime);
        } else {
          const endTimeValue = sheetName.cell(`E${colNumber}`).value(endTime);
          const restValue = sheetName.cell(`F${colNumber}`).value(rest);
          const workTimeValue = sheetName.cell(`G${colNumber}`).value(workTime);
          const overTimeValue = sheetName.cell(`H${colNumber}`).value(overTime);
        }

        workbook.toFileAsync('/tmp/勤怠請負用(2020)_片田.xlsm').then(() => {

          params.Body = fs.readFileSync('/tmp/勤怠請負用(2020)_片田.xlsm');
    
          s3.putObject(params, (err, data) => {
            if (err) { console.log(err); }
            console.log('処理が完了しました');
            context.done()
          })

        });


    });
  })
}
