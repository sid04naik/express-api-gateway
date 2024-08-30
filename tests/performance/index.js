import http from "k6/http";
import { check, group, sleep } from "k6";
import { faker } from 'https://esm.sh/@faker-js/faker@v8.4.0';

const configuration = {
  host: "http://localhost",
  token: "token"
}


export const options = {
  vus: 2,
  duration: "5s",
  thresholds: {
    checks: ["rate >= 1.0"],
    "http_req_duration{group:::GET}": ["p(95) < 200"],
  },
};



export default function () {
  group("GET", function () {
    const params = {
      headers: { Authorization: `Bearer ${configuration.token}`, "Content-Type": "application/json" },
    };
    const res = http.get(`${configuration.host}/metrics`, params);
    check(res, { "status was 200": (r) => r.status == 200 });
    sleep(1);
  });
}
