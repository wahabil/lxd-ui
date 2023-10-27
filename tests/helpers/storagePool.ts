import { Page } from "@playwright/test";
import { TIMEOUT } from "./constants";
import { randomNameSuffix } from "./name";

export const randomPoolName = (): string => {
  return `playwright-pool-${randomNameSuffix()}`;
};

export const createPool = async (page: Page, pool: string) => {
  await page.goto("/ui/");
  await page.getByRole("link", { name: "Storage" }).click();
  await page.getByRole("button", { name: "Create pool" }).click();
  await page.getByPlaceholder("Enter name").fill(pool);
  await page.getByLabel("Driver").selectOption("dir");
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page.waitForSelector(`text=Storage pool ${pool} created.`, TIMEOUT);
};

export const deletePool = async (page: Page, pool: string) => {
  await visitPool(page, pool);
  await page.getByRole("button", { name: "Delete pool" }).click();
  await page
    .getByRole("dialog", { name: "Confirm delete" })
    .getByRole("button", { name: "Delete pool" })
    .click();
  await page.waitForSelector(`text=Storage pool ${pool} deleted.`, TIMEOUT);
};

export const visitPool = async (page: Page, pool: string) => {
  await page.goto("/ui/");
  await page.getByRole("link", { name: "Storage" }).click();
  await page.getByRole("link", { name: pool }).first().click();
};

export const editPool = async (page: Page, pool: string) => {
  await visitPool(page, pool);
  await page.getByTestId("tab-link-Configuration").click();
  await page.getByRole("button", { name: "Edit pool" }).click();
};

export const savePool = async (page: Page) => {
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForSelector(`text=Storage pool updated.`, TIMEOUT);
};
