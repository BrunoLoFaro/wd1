function sendMail (req, res, next){
    logger.info('logging out')
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: 'nels.yost71@ethereal.email', // generated ethereal user
            pass: 'wMvBbSXGhrV12cT948', // generated ethereal password
            },
            });
            let date_obj2 = moment().format('DD/MM/YYYY HH:mm')
            // send mail with defined transport object
                transporter.sendMail({
                from: '"Servidor node', // sender address
                to: usuarios[0].mail, // list of receivers
                subject: "log out", // Subject line
                text: usuarios[0].name + " se logeo al ecommerce de venta de libros a las " + date_obj2, // plain text body
                html: "<b>Hello world!</b>", // html body
        },(err,inf)=>{
        if(err){
        logger.waring(err)
        return err
        }
        });
        logger.info('mail de logout mandado')
next()
}