export enum ErrorCodes {
    TOKEN_VERIFICATION_ERROR = 'Wystąpił problem z weryfikacją Twojego tokenu.',
    NO_ACCESS = 'Nie masz dostępu do tego zasobu.',

    NO_SUCH_STUDENT_IN_THIS_ROOM = 'W tym pokoju nie ma zapisanego takiego studenta.',
    CANNOT_REMOVE_THIS_STUDENT = 'Nie możesz usunąć tego studenta. Ktoś inny zaposał go do tego pokoju.',
    DUPLICATED_STUDENT_IN_THIS_ROOM ='W tym pokoju już jest zapisany taki uczestnik!',

    CANNOT_RESERVE_THIS_ROOM = 'Nie możesz teraz zapisywać do tego pokoju, ktoś inny to teraz robi.',
    NO_FREE_SPACE_IN_ROOM = 'Nie już wolnych miejsc w tym pokoju.'
}