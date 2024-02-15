const amqp = require('amqplib');
const queueName = process.argv[2] || "jobsQueue";
const data = require('./data.json');

connect_rabbitmq();

async function connect_rabbitmq(){
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const assertion = await channel.assertQueue(queueName);


      // receiving the message:

        console.log('waiting for message...');
        channel.consume(queueName,(message)=>{
            const messageInfo = JSON.parse(message.content.toString());
            // {description:16}
            const userInfo = data.find(u => u.id == messageInfo.description);
            if(userInfo){
                console.log('processed data :', userInfo);
                channel.ack(message);
                
            }
        });
        /* ============= Interval.==========================================================
    setInterval(() => {
        message.description = new Date().getTime();
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log("Gonderilen Mesaj", message);
    }, 1);
    // ============= Interval.========================================================== */


    } catch (error) {
        console.log('Error:',error);
    }
}