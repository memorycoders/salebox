//@flow

const phoneRegex = /^[+]?[(]?[0-9]{1,6}[)]?[-\s.]?[0-9]{1,6}[-\s.]?[0-9]{1,6}$/im;

export default (phone: string) => phoneRegex.test(phone);
