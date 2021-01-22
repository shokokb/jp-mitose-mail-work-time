const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fromEmail = functions.config().gmail.email;
const fromEmailPassword = functions.config().gmail.password;

const senderName = functions.config().sender.name;

const receiverName = functions.config().receiver.name;
const receiverCompany = functions.config().receiver.company;
const receiverMail = functions.config().receiver.mail;

const timeStart = functions.config().workday.start;
const timeEnd = functions.config().workday.end;

admin.initializeApp();

exports.sendMail = functions
    .region("asia-northeast1")
    .https.onRequest((req, res) => {
      const now = new Date();
      // const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const week = now.getDay();
      const weekJp = ["日", "月", "火", "水", "木", "金", "土"];

      const TUESDAY = 2;
      const FRIDAY = 5;
      if (TUESDAY <= week && week <= FRIDAY) {
        const send = require("gmail-send")({
          user: fromEmail,
          pass: fromEmailPassword,
          to: [receiverMail],
          bcc: fromEmail,
          subject:
          `【勤怠】${senderName}-${month}月${day}日(${weekJp[week]})-` +
          `${timeStart}-${timeEnd}`,
        });

        send(
            {
              text:
            `${receiverCompany} ${receiverName}様\n\n` +
            `お疲れ様です。${senderName}です。\n` +
            `${month}月${day}日(${weekJp[week]})の勤怠は` +
            `${timeStart}~${timeEnd}です。\n` +
            "打刻、ありがとうございます。",
            },
            (error, result, fullResult) => {
              if (error) console.error(error);
              console.log(result);
            }
        );
        res.send("勤怠送信");
      } else {
        res.send("休日");
      }
    });
