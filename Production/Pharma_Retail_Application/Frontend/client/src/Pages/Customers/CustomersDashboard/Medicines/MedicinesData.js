// src/.../MedicinesData.js
import allopathyImg from "../../../../assets/Customers/Medicines/allopathy.png";
import ayurvedicImg from "../../../../assets/Customers/Medicines/ayurvedic.png";
import homeopathyImg from "../../../../assets/Customers/Medicines/homeopathy.png";
import unaniImg from "../../../../assets/Customers/Medicines/unani.png";
import herbalImg from "../../../../assets/Customers/Medicines/herbal.png";
import supplementsImg from "../../../../assets/Customers/Medicines/supplements.png";
import otcImg from "../../../../assets/Customers/Medicines/otc.png";

import painRelief from "../../../../assets/Customers/Medicines/pain-relief.png";
import vitamins from "../../../../assets/Customers/Medicines/vitamins.png";
import firstAid from "../../../../assets/Customers/Medicines/first-aid.png";
import diabetes from "../../../../assets/Customers/Medicines/diabetes.png";
import coldCough from "../../../../assets/Customers/Medicines/cold-cough.png";
import heartBp from "../../../../assets/Customers/Medicines/heart-bp.png";
import digestiveHealth from "../../../../assets/Customers/Medicines/digestive-health.png";
import oralCare from "../../../../assets/Customers/Medicines/oral-care.png";
import skincare from "../../../../assets/Customers/Medicines/skincare.png";
import babycare from "../../../../assets/Customers/Medicines/babycare.png";
import wellness from "../../../../assets/Customers/Medicines/wellness.png";
import surgical from "../../../../assets/Customers/Medicines/surgical.png";

/**
 * Top-level categories (unchanged)
 */
export const medicineCategories = [
  { title: "Allopathy", img: allopathyImg },
  { title: "Ayurvedic", img: ayurvedicImg },
  { title: "Homeopathy", img: homeopathyImg },
  { title: "Unani", img: unaniImg },
  { title: "Herbal/Organic", img: herbalImg },
  { title: "Supplements", img: supplementsImg },
  { title: "Over-the-Counter", img: otcImg },
];

/**
 * Subcategories: now include `id` (stable key used for medicinesBySub)
 * ids are kebab-case, suitable as keys in medicinesBySub.
 */
export const subCategories = [
  {
    id: "pain-relief",
    title: "Pain Relief",
    products: "150+ products",
    img: painRelief,
  },
  {
    id: "vitamins",
    title: "Vitamins",
    products: "150+ products",
    img: vitamins,
  },
  {
    id: "first-aid",
    title: "First Aid",
    products: "150+ products",
    img: firstAid,
  },
  {
    id: "diabetes",
    title: "Diabetes",
    products: "150+ products",
    img: diabetes,
  },
  {
    id: "cold-cough",
    title: "Cold & Cough",
    products: "150+ products",
    img: coldCough,
  },
  {
    id: "heart-bp",
    title: "Heart & BP",
    products: "150+ products",
    img: heartBp,
  },
  {
    id: "digestive-health",
    title: "Digestive Health",
    products: "150+ products",
    img: digestiveHealth,
  },
  {
    id: "oral-care",
    title: "Oral Care",
    products: "150+ products",
    img: oralCare,
  },
  {
    id: "skincare",
    title: "Skincare",
    products: "150+ products",
    img: skincare,
  },
  {
    id: "babycare",
    title: "BabyCare",
    products: "150+ products",
    img: babycare,
  },
  {
    id: "wellness",
    title: "Wellness",
    products: "150+ products",
    img: wellness,
  },
  {
    id: "surgical",
    title: "Surgical",
    products: "150+ products",
    img: surgical,
  },
];


