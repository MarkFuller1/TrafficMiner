namespace TrafficDataPrep
{
    using System;
    using System.IO;

    /// <summary>
    /// Defines the <see cref="Utility" />.
    /// </summary>
    internal class Utility
    {
        /// <summary>
        /// The Main.
        /// </summary>
        internal static void Main()
        {
            //string filename = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources\Conejo and Hillcrest EB 0205 _421802051_20200813_094758\1.csv";
            string filename = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources\Conejo and Hillcrest EB 0205 _421802051_20200813_094758.csv";
            Utility.MinDate(filename);
            Console.Read();
        }

        /// <summary>
        /// The Head.
        /// </summary>
        /// <param name="filename">The filename<see cref="string"/>.</param>
        internal static void Head(string filename)
        {
            StreamReader reader = new StreamReader(filename);
            Console.WriteLine(reader.ReadLine());
        }

        internal static void MinDate(string filepath)
        {
            DateTime minDate = DateTime.MaxValue;
            DateTime maxDate = DateTime.MinValue;

            System.IO.StreamReader reader = new System.IO.StreamReader(filepath);

            string line;
            int counter = 0;
            while ((line = reader.ReadLine()) != null)
            {
                var fields = line.Split(",");
                var date = DateTime.ParseExact(fields[0], "yyyy/MM/dd HH:mm:ss.fff", new System.Globalization.CultureInfo("en-US"));
              
                minDate = (date < minDate) ? date : minDate;
                maxDate = (date > maxDate) ? date : maxDate;

                counter++;
            }

            reader.Close();
            Console.WriteLine("First Day:" + minDate.ToString("yyyy / MM / dd HH: mm:ss.fff", new System.Globalization.CultureInfo("en-US")));
            Console.WriteLine("Last Day:" + maxDate.ToString("yyyy / MM / dd HH: mm:ss.fff", new System.Globalization.CultureInfo("en-US")));
        }
    }
}
