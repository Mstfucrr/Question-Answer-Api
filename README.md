# Question-Answer-Api


<h3> Bağımlılıklar: </h3>
  <ul>
    <li>expressjs - HTTP isteklerini işlemek ve yönlendirmek için sunucu </li>
    <li>jsonwebtoken - Kimlik doğrulama tarafından kullanılan JWT'leri oluşturmak için </li>
    <li>firavun faresi - MongoDB verilerini modellemek ve JavaScript'e eşlemek için</li>
    <li> slugify - Başlıkları URL dostu bir biçimde kodlamak için</li>
    <li> bcryptjs - Karma Şifre</li>
    <li> dotenv - Ortam değişkenlerini yükleyen Sıfır Bağımlılık modülü</li>
    <li> multer - Dosyaları karşıya yüklemek için Node.js ara yazılımı</li>
    <li> nodemailer - Node.js'den e-posta gönder</li>
    <li> Uygulama Yapısı</li>
 </ul>

<h3>  Uygulama Yapısı  </h3>
  <ul>

<li>server.js - Uygulamamızın giriş noktası. Bu dosya express sunucumuzu tanımlar ve mongoose kullanarak MongoDB'ye bağlar. Ayrıca uygulamada kullanacağımız rotaları da içerir.</li>
<li>config/ - Bu klasör, merkezi konum ortam değişkenleri ve diğer yapılandırmalar için konfigürasyon içerir.</li>
<li>routes/ - Bu klasör API'miz için rota tanımlarını (cevap, soru vb.) içerir.</li>
<li>models/ - Bu klasör Mongoose modellerimiz (Kullanıcı, Soru) için şema tanımlarını içerir.</li>
<li>controllers/ - Bu klasör API'miz için kontrolcüleri içerir.</li>
<li>public/ - Bu klasör API'miz için statik dosyaları içerir.</li>
<li>middlewares/ - Bu klasör API'miz için ara yazılımları içerir.</li>
<li>helpers/ - Bu klasör, API'miz için 3. parti kütüphaneleri uyarlamak için yardımcı fonksiyonlar içerir.</li>
<li>dummy/ - Bu klasör, veritabanımız için dummy-generator.js dosyası tarafından oluşturulan sahte verileri içerir.</li>
 </ul>

Kaynak : Mustafa Murat Coşkun ==> <a href="https://github.com/mustafamuratcoskun/question-answer-rest-api" target="_blank"> Link </a>
