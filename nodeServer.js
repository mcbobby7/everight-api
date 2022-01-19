import Service from 'node-windows';

const myService = Service.Service
// Create a new service object
var svc = new myService({
  name:'EverightNodeServer',
  description: 'Everight API nodejs web server.',
  // script: 'C:\\inetpub\\Hmsnodejs\\index.js',
  script: 'C:\\Users\\Philip\\source\\repos\\LotusNotificationApp\\app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});
svc.on('install',function(){
  svc.start();
});

svc.install();