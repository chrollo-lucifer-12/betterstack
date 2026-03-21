import { treaty } from "@elysiajs/eden";
import { app } from "../src";
import { describe, expect, it, mock } from "bun:test";
import { mockDB } from "@repo/db";

mock.module("@repo/db", () => ({ mockDB }));

const api = treaty(app);

describe("POST /website/create", () => {
  it("creates website", async () => {});
});
