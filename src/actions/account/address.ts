"use server";
import { prisma } from "@/lib/db/prisma";
import { TAddressForm } from "@/lib/types";

export async function createAddress(accountId: string, data: TAddressForm) {
  try {
    const { city, email, name, phone, pin, state, street } = data;
    const address = await prisma.address.create({
      data: {
        city,
        email,
        name,
        phone,
        pin,
        state,
        street,
        accountId: accountId,
      },
    });
    return { status: 201, json: address };
  } catch (error) {
    console.error("Error creating address:", error);
    return { status: 500, json: { error: "Internal Server Error" } };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    await prisma.address.delete({
      where: { id: addressId },
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return { status: 500, json: { error: "Internal Server Error" } };
  }
}

export async function updateAddress(addressId: string, data: TAddressForm) {
  try {
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        ...data,
      },
    });
    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);
    return { status: 500, json: { error: "Internal Server Error" } };
  }
}

export async function getAddressesByAccount(accountId: string | null) {
  if (accountId === "" || accountId === null) return [];
  try {
    const addresses = await prisma.address.findMany({
      where: { accountId: accountId },
    });
    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}

export async function getAddressById(addressId: string) {
  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    return address;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
}

// Set an address as the default for the account
export async function setDefaultAddress(accountId: string, addressId: string) {
  try {
    // Unset previous default address
    await prisma.address.updateMany({
      where: {
        accountId: accountId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Set the new default address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        isDefault: true,
      },
    });

    return updatedAddress;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
}
