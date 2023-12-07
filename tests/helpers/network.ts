import { Page } from "@playwright/test";
import { TIMEOUT } from "./constants";
import { randomNameSuffix } from "./name";

export const randomNetworkName = (): string => {
  return `test-${randomNameSuffix()}`;
};

export const createNetwork = async (page: Page, network: string) => {
  await page.goto("/ui/");
  await page.getByRole("link", { name: "Networks", exact: true }).click();
  await page.getByRole("button", { name: "Create network" }).click();
  await page.getByRole("heading", { name: "Create a network" }).click();
  await page.getByLabel("Name").click();
  await page.getByLabel("Name").fill(network);
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page.waitForSelector(`text=Network ${network} created.`, TIMEOUT);
};

export const deleteNetwork = async (page: Page, network: string) => {
  await visitNetwork(page, network);
  await page.getByRole("button", { name: "Delete network" }).click();
  await page
    .getByRole("dialog", { name: "Confirm delete" })
    .getByRole("button", { name: "Delete" })
    .click();
  await page.waitForSelector(`text=Network ${network} deleted.`, TIMEOUT);
};

export const visitNetwork = async (page: Page, network: string) => {
  await page.getByTitle("Networks (default)").click();
  await page.getByRole("link", { name: network }).first().click();
};

export const saveNetwork = async (page: Page) => {
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForSelector(`text=Network updated.`, TIMEOUT);
};

export const editNetwork = async (page: Page, network: string) => {
  await visitNetwork(page, network);
  await page.getByTestId("tab-link-Configuration").click();
  await page.getByRole("button", { name: "Edit network" }).click();
};

export const createNetworkForward = async (page: Page, network: string) => {
  await visitNetwork(page, network);

  await page.getByTestId("tab-link-Configuration").click();
  await page.getByRole("button", { name: "Edit network" }).click();
  const networkSubnet = await page.inputValue("input#ipv4_address");

  const listenAddress = networkSubnet.replace("1/24", "1");
  const targetAddress = networkSubnet.replace("1/24", "3");

  await page.getByTestId("tab-link-Forwards").click();
  await page.getByRole("link", { name: "Create forward" }).click();
  await page.getByLabel("Listen address").fill(listenAddress);

  await page.getByRole("button", { name: "Add port" }).click();
  await page.getByLabel("Listen port").fill("80");
  await page.getByLabel("Target address", { exact: true }).fill(targetAddress);
  await page.getByRole("button", { name: "Add port" }).click();
  await page
    .getByRole("textbox", { name: "Listen port", exact: true })
    .fill("23,443-455");
  await page
    .getByRole("textbox", { name: "Target address", exact: true })
    .fill(targetAddress);
  await page.getByRole("button", { name: "Create" }).click();

  await page.getByText(`Network forward ${listenAddress} created.`).click();
  await page.getByText(`:80 → ${targetAddress}:80 (tcp)`).click();
  await page
    .getByText(`:23,443-455 → ${targetAddress}:23,443-455 (tcp)`)
    .click();
};
