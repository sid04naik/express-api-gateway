import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
	vus: 2,
	duration: "5s",
	thresholds: {
		checks: ["rate >= 1.0"],
		"http_req_duration{group:::GET}": ["p(95) < 350"],
	},
};

export default function () {
	group("GET", function () {
		const res = http.get("http://localhost:8002/metrics");
		check(res, { "status was 200": (r) => r.status == 200 });
		sleep(1);
	});
}
