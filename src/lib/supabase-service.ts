import { supabase } from './supabase';
import type { Proprietor, School, Payment } from './supabase';

export const proprietorService = {
  // Create or update proprietor
  async createProprietor(data: Partial<Proprietor>) {
    const { data: result, error } = await supabase
      .from('proprietors')
      .insert([{
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        state: data.state,
        lga: data.lga,
        passport_photo_url: data.passport_photo_url,
        chapters: data.chapters,
        napps_registered: data.napps_registered || 'Not Registered'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  // Get proprietor by email or phone
  async getProprietorByEmailOrPhone(email: string, phone: string) {
    const { data, error } = await supabase
      .from('proprietors')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Get proprietor by ID
  async getProprietorById(id: string) {
    const { data, error } = await supabase
      .from('proprietors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const schoolService = {
  // Create school
  async createSchool(data: Partial<School>) {
    const { data: result, error } = await supabase
      .from('schools')
      .insert([{
        name: data.name!,
        state: data.state!,
        lga: data.lga!,
        chapter: data.chapter,
        proprietor_id: data.proprietor_id,
        type: data.type,
        category: data.category,
        address: data.address,
        total_enrollment: data.total_enrollment || 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  // Get school by proprietor ID
  async getSchoolByProprietorId(proprietorId: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('proprietor_id', proprietorId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update school
  async updateSchool(id: string, data: Partial<School>) {
    const { data: result, error } = await supabase
      .from('schools')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }
};

export const paymentService = {
  // Create payment record
  async createPayment(data: Partial<Payment>) {
    const { data: result, error } = await supabase
      .from('payments')
      .insert([{
        reference: data.reference!,
        proprietor_id: data.proprietor_id,
        school_id: data.school_id,
        amount: data.amount!,
        dues_breakdown: data.dues_breakdown!,
        deductions: data.deductions,
        payment_method: data.payment_method,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  // Update payment status
  async updatePaymentStatus(reference: string, status: string, receiptNumber?: string, schoolId?: string) {
    const updateData: any = { status };
    if (receiptNumber) updateData.receipt_number = receiptNumber;
    if (schoolId) updateData.school_id_text = schoolId;

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('reference', reference)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get payment by reference
  async getPaymentByReference(reference: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*, schools(*)')
      .eq('reference', reference)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

export const enrollmentService = {
  // Save enrollment data
  async saveEnrollment(schoolId: string, enrollment: Record<string, number>) {
    const entries = Object.entries(enrollment).map(([level, count]) => ({
      school_id: schoolId,
      level,
      male: count.male || 0,
      female: count.female || 0
    }));

    const { data, error } = await supabase
      .from('enrollment')
      .insert(entries)
      .select();
    
    if (error) throw error;
    return data;
  }
};
