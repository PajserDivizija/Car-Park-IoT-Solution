#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Arduino_JSON.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

int stup = 0;
int trigPin = 4;
int echoPin = 5;
long duration, distance;
int udaljenost = 30;
String value = "slobodno";

const char* ssid = "MATEJ1";
const char* password = "13021998";

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
const char* awsEndpoint = "a2016qudzca8cj-ats.iot.us-east-1.amazonaws.com";

WiFiClientSecure espClient;
void msgReceived(char* topic, byte* payload, unsigned int len);
PubSubClient pubSubClient(awsEndpoint, 8883, msgReceived, espClient);


void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("ESP8266 AWS IoT Example");
  setup_wifi();
  
  pinMode(stup, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  delay(1000);
  if (!SPIFFS.begin()) {
    Serial.println("Failed to mount file system");
    return;
  }

  Serial.print("Heap: "); Serial.println(ESP.getFreeHeap());

  // Load certificate file
  File cert = SPIFFS.open("/cert.der", "r"); //replace cert.crt eith your uploaded file name
  if (!cert) {
    Serial.println("Failed to open cert file");
  }
  else
    Serial.println("Success to open cert file");

  delay(1000);

  if (espClient.loadCertificate(cert))
    Serial.println("cert loaded");
  else
    Serial.println("cert not loaded");

  // Load private key file
  File private_key = SPIFFS.open("/private.der", "r"); //replace private eith your uploaded file name
  if (!private_key) {
    Serial.println("Failed to open private cert file");
  }
  else
    Serial.println("Success to open private cert file");

  delay(1000);

  if (espClient.loadPrivateKey(private_key))
    Serial.println("private key loaded");
  else
    Serial.println("private key not loaded");



    // Load CA file
    File ca = SPIFFS.open("/ca.der", "r"); //replace ca eith your uploaded file name
    if (!ca) {
      Serial.println("Failed to open ca ");
    }
    else
    Serial.println("Success to open ca");

    delay(1000);

    if(espClient.loadCACert(ca))
    Serial.println("ca loaded");
    else
    Serial.println("ca failed");

  Serial.print("Heap: "); Serial.println(ESP.getFreeHeap());
}

unsigned long lastPublish;
int msgCount;

void loop() {
  pubSubCheckConnect();

  int distance = calculateDistance();
  //Serial.println(distance);
  if(distance <= udaljenost && value == "slobodno"){
    value = "zauzeto";
    String str = "{ \"state\": { \"reported\": { \"senzor\":\"" + value + "\"} } }";
    Serial.println(str);
    pubSubClient.publish("$aws/things/esp-8266-v2/shadow/update", str.c_str ());
  }
  if(distance > udaljenost && value == "zauzeto"){
    value = "slobodno";
    String str = "{ \"state\": { \"reported\": { \"senzor\":\"" + value + "\"} } }";
    Serial.println(str);
    pubSubClient.publish("$aws/things/esp-8266-v2/shadow/update", str.c_str ());
  }
  delay(500);
}

int calculateDistance(){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = (duration/2)/29.1;
  return distance;
}

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  espClient.setBufferSizes(512, 512);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  timeClient.begin();
  while(!timeClient.update()){
    timeClient.forceUpdate();
  }

  espClient.setX509Time(timeClient.getEpochTime());

}

void msgReceived(char* topic, byte* payload, unsigned int length){
  Serial.print("Message received on "); Serial.print(topic); Serial.print(": ");
  String msgIN = "";
  for(int i = 0; i < length; i++){
    msgIN += (char)payload[i];
  }
  String msgString = msgIN;
  Serial.println(msgString);
  JSONVar myObject = JSON.parse(msgString);

  if(String(topic) == "$aws/things/esp-8266-v2/shadow/get/accepted"){ //delta promjena
    String led = (const char*) myObject["state"]["desired"]["led"];
    String led1 = (const char*) myObject["state"]["reported"]["led"];

    Serial.println("LED: " + led + " ,LED 1: " + led1);

    if(led != led1){
      if(led == "1"){
        digitalWrite(stup, HIGH);
      }else{
        digitalWrite(stup, LOW);
      }

      String str = "{ \"state\": { \"reported\": { \"led\":\"" + led + "\"} } }";
      pubSubClient.publish("$aws/things/esp-8266-v2/shadow/update", str.c_str ());
    }
  }

  if(String(topic) == "$aws/things/esp-8266-v2/shadow/update/delta"){
    pubSubClient.publish("$aws/things/esp-8266-v2/shadow/get", "{}");
  }
  Serial.println();
}

void pubSubCheckConnect() {
  if(!pubSubClient.connected()){
    Serial.print("PubSubClient connecting to: "); Serial.print(awsEndpoint);
    while(!pubSubClient.connected()){
      Serial.print(".");
      pubSubClient.connect("esp-8266-v2");
    }
    Serial.println(" connected");

    pubSubClient.subscribe("$aws/things/esp-8266-v2/shadow/get/accepted");
    pubSubClient.subscribe("$aws/things/esp-8266-v2/shadow/update/delta");
    
    pubSubClient.publish("$aws/things/esp-8266-v2/shadow/get", "{}");
  }
  pubSubClient.loop();
}
