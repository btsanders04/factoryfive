
// Define a Part interface to avoid duplication
export interface Part {
  part_number?: string;
  description?: string;
  category_number?: string;
  quantity?: number;
}

export interface BoxData {
  box_number?: string;
  categories?: Array<{
    category_name?: string;
    category_number?: string;
  }>;
  // Parts that are not in a category
  parts?: Part[];
}